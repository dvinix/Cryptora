import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from .config import settings
import logging

logger = logging.getLogger(__name__)

# In-memory token-to-encryption-key store (should be Redis in production)
_token_encryption_keys: Dict[str, str] = {}


class TokenService:
    """JWT token generation and validation service"""

    @staticmethod
    def create_token(user_id: int, alias: str, encryption_key: Optional[str] = None, expires_in_hours: Optional[int] = None) -> str:
        """
        Create a JWT token for a user.
        
        Args:
            user_id: User ID
            alias: User alias
            encryption_key: Optional encryption key to store with token
            expires_in_hours: Token expiration time in hours (defaults to JWT_EXPIRATION_HOURS)
        
        Returns:
            JWT token string
        """
        if expires_in_hours is None:
            expires_in_hours = settings.JWT_EXPIRATION_HOURS
        
        payload = {
            "sub": str(user_id),  # subject: user_id
            "alias": alias,
            "exp": datetime.utcnow() + timedelta(hours=expires_in_hours),
            "iat": datetime.utcnow(),
        }
        
        token = jwt.encode(
            payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )
        
        # Store encryption key if provided
        if encryption_key:
            _token_encryption_keys[token] = encryption_key
        
        logger.info(f"Token created for user {alias} (ID: {user_id})")
        return token

    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """
        Verify and decode a JWT token.
        
        Args:
            token: JWT token string
        
        Returns:
            Decoded token payload if valid, None if invalid/expired
        """
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            # Clean up expired token's encryption key
            if token in _token_encryption_keys:
                del _token_encryption_keys[token]
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            return None

    @staticmethod
    def get_user_id_from_token(token: str) -> Optional[int]:
        """Extract user_id from token"""
        payload = TokenService.verify_token(token)
        if payload:
            try:
                return int(payload.get("sub"))
            except (ValueError, TypeError):
                return None
        return None

    @staticmethod
    def get_alias_from_token(token: str) -> Optional[str]:
        """Extract alias from token"""
        payload = TokenService.verify_token(token)
        if payload:
            return payload.get("alias")
        return None

    @staticmethod
    def store_encryption_key(token: str, encryption_key: str) -> None:
        """Store encryption key associated with a token"""
        _token_encryption_keys[token] = encryption_key
        logger.debug(f"Encryption key stored for token")

    @staticmethod
    def get_encryption_key(token: str) -> Optional[str]:
        """Retrieve encryption key associated with a token"""
        # First verify token is valid
        if not TokenService.verify_token(token):
            return None
        return _token_encryption_keys.get(token)

    @staticmethod
    def cleanup_token(token: str) -> None:
        """Remove token and associated encryption key"""
        if token in _token_encryption_keys:
            del _token_encryption_keys[token]
        logger.debug(f"Token cleaned up")
