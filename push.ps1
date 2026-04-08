& "C:\Program Files\Git\cmd\git.exe" config user.email "ankit@example.com"
& "C:\Program Files\Git\cmd\git.exe" config user.name "Ankit"
& "C:\Program Files\Git\cmd\git.exe" add .
& "C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit for deployment"
& "C:\Program Files\Git\cmd\git.exe" remote remove origin 2>$null
& "C:\Program Files\Git\cmd\git.exe" remote add origin https://github.com/shreyranjan18/Govsparks.git
& "C:\Program Files\Git\cmd\git.exe" branch -M main
& "C:\Program Files\Git\cmd\git.exe" push -u origin main
