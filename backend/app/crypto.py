"""
Server-side encryption utilities for simple API mode.
Note: In production zero-knowledge mode, encryption happens client-side only.
This is for testing/simplified API usage.
"""
import hashlib
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import os


class CryptoUtils:
    """Simple encryption utilities for server-side operations"""
    
    @staticmethod
    def derive_key(password: str, salt: bytes) -> bytes:
        """Derive encryption key from password using PBKDF2"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
            backend=default_backend()
        )
        return kdf.derive(password.encode('utf-8'))
    
    @staticmethod
    def encrypt(plaintext: str, password: str) -> str:
        """
        Encrypt plaintext with password using AES-256-GCM
        Returns base64 encoded: salt (16 bytes) + nonce (12 bytes) + ciphertext
        """
        # Generate random salt and nonce
        salt = os.urandom(16)
        nonce = os.urandom(12)
        
        # Derive key from password
        key = CryptoUtils.derive_key(password, salt)
        
        # Encrypt
        aesgcm = AESGCM(key)
        ciphertext = aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)
        
        # Combine: salt + nonce + ciphertext
        combined = salt + nonce + ciphertext
        
        # Return as base64
        return base64.b64encode(combined).decode('utf-8')
    
    @staticmethod
    def decrypt(encrypted_data: str, password: str) -> str:
        """
        Decrypt encrypted data with password
        Returns plaintext or raises exception if password is wrong
        """
        # Decode from base64
        combined = base64.b64decode(encrypted_data)
        
        # Extract components
        salt = combined[:16]
        nonce = combined[16:28]
        ciphertext = combined[28:]
        
        # Derive key
        key = CryptoUtils.derive_key(password, salt)
        
        # Decrypt
        aesgcm = AESGCM(key)
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        
        return plaintext.decode('utf-8')
    
    @staticmethod
    def hash_content(content: str) -> str:
        """Generate SHA-256 hash of content"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
