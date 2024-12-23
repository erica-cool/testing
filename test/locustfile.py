from locust import HttpUser, task, between

class SmokeTestUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def get_homepage(self):
        response = self.client.get('/')
        if response.status_code != 200:
            response.failure(f"Expected status code 200 but got {response.status_code}")
