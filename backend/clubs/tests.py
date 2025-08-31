import requests

club_id = 1
poll_id = 4
option_id = 2   # ✅ from the poll options you just fetched

url = f"http://127.0.0.1:8000/api/clubs/{club_id}/polls/{poll_id}/vote/"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2NTgyNTcwLCJpYXQiOjE3NTY1ODIyNzAsImp0aSI6ImQyMDE4YjgzMGE1NDRjYmE5ODFkM2IwNjFlMWY2YTcwIiwidXNlcl9pZCI6IjEifQ.a8wF26K-1YBo9x6LW-vjvJY8TFxOYb1Yvx7k-A4AZ-o"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

data = {
    "optionId": option_id
}

response = requests.post(url, headers=headers, json=data)

print("Status Code:", response.status_code)
print("Response Text:", response.text if response.text else "Vote successful (204 No Content)")
