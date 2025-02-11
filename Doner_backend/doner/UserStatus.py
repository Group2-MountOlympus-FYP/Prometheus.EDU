from flask import jsonify
from enum import Enum

class UserStatus(Enum):
    NORMAL = 'normal'
    VIP = 'vip'
    BANNED = 'banned'