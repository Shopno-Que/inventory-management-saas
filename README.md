## Running the Application Locally

### Prerequisites

* Python 3.x

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Create and activate a virtual environment:

   **Windows**

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

   **macOS / Linux**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install the project dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Apply the database migrations:

   ```bash
   python manage.py migrate
   ```

5. Generate the default store permissions:

   ```bash
   python manage.py create_store_permissions
   ```

6. Start the development server:

   ```bash
   python manage.py runserver
   ```

7. Open your browser and visit:

   ```
   http://127.0.0.1:8000/
   ```
