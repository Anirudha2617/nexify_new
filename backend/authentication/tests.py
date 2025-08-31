import requests

BASE_URL = "http://127.0.0.1:8000"

# Step 1: Login to get tokens
login_data = {
    "username": "aniru",
    "password": "AniS@12345"
}
token_res = requests.post(f"{BASE_URL}/api/token/", json=login_data)

if token_res.status_code != 200:
    print("Login failed:", token_res.json())
    exit()

tokens = token_res.json()
access_token = tokens["access"]

# Step 2: Use access token to call profile endpoint
headers = {"Authorization": f"Bearer {access_token}"}
profile_res = requests.get(f"{BASE_URL}/api/user/profile", headers=headers)

print("Status:", profile_res.status_code)
print("Response JSON:", profile_res.json())
