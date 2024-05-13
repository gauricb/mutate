from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_register_user():
    # Test successful registration
    response = client.post(
        "/register",
        json={
            "username": "test_user",
            "email": "test@example.com",
            "password": "test_password",
        },
    )
    assert response.status_code == 201
    assert response.json() == {"message": "User registered successfully"}

    # Test registration with existing username
    response = client.post(
        "/register",
        json={
            "username": "test_user",
            "email": "new_test@example.com",
            "password": "new_test_password",
        },
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Username already taken"}

    # Test registration with existing email
    response = client.post(
        "/register",
        json={
            "username": "new_test_user",
            "email": "test@example.com",
            "password": "new_test_password",
        },
    )
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}


def test_login_for_access_token():
    # Test successful login
    response = client.post("/token", data={"username": "jane", "password": "123"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

    # Test login with incorrect password
    response = client.post(
        "/token", data={"username": "test_user", "password": "incorrect_password"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect username or password"}


test_login_for_access_token()
test_register_user()
