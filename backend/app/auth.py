from fastapi import Header, HTTPException

ADMIN_SECRET = "JUDGES_ONLY_SECRET"


def verify_admin(x_admin_token: str = Header(None)):
    if x_admin_token != ADMIN_SECRET:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized admin access"
        )
