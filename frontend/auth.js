async function signUp(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Signup successful:', data);
            alert('Signup successful! You can now login.');
            window.location.href = 'frontend/login.html';
        } else {
            throw new Error(data.message || 'Signup failed');
        }
    } catch (error) {
        console.error('Signup failed:', error);
        alert('Signup failed: ' + error.message);
    }
}

async function login(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        window.location.href = '/frontend/create-expense.html'; // Adjusted redirect path
      } else {
        const errorData = await response.json(); // Assuming the server sends JSON errors
        console.error('Login failed:', errorData);
        alert('Login failed: ' + (errorData.message || 'The server response is not valid JSON.'));
      }
    } catch (error) {
      console.error('Error during fetch:', error);
      alert('Login failed: ' + (error.message || 'An unknown error occurred.'));
    }
  }
  



  