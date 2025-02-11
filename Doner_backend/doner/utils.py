import os


import hashlib

def hash_file_contents(file):
    hasher = hashlib.sha256()
    buf = file.read()
    hasher.update(buf)
    file_hash = hasher.hexdigest()
    original_filename=file.filename
    _, file_extension = os.path.splitext(original_filename)
    hashed_filename = file_hash + file_extension
    return hashed_filename
