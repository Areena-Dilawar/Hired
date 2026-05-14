import os
import re

files = [
    r"d:\Hired\Hired\src\app\api\upload\route.ts",
    r"d:\Hired\Hired\src\app\api\saved\routes.ts",
    r"d:\Hired\Hired\src\app\api\jobs\[id]\route.ts",
    r"d:\Hired\Hired\src\app\api\jobs\[id]\match\route.ts",
    r"d:\Hired\Hired\src\app\api\jobs\route.ts",
    r"d:\Hired\Hired\src\app\api\applications\route.ts",
    r"d:\Hired\Hired\src\app\api\admin\route.ts",
    r"d:\Hired\Hired\src\app\api\applications\mine\route.ts",
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace imports
    content = re.sub(r'import\s+{\s*getServerSession\s*}\s*from\s*"next-auth";', 'import { auth } from "@/auth";', content)
    content = re.sub(r'import\s+{\s*authOptions\s*}\s*from\s*"@/app/api/auth/\[\.\.\.nextauth\]/route";', '', content)
    
    # Replace usage
    content = re.sub(r'await\s+getServerSession\(authOptions\)', 'await auth()', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file_path}")

# Rename routes.ts to route.ts
old_path = r"d:\Hired\Hired\src\app\api\saved\routes.ts"
new_path = r"d:\Hired\Hired\src\app\api\saved\route.ts"
if os.path.exists(old_path):
    os.rename(old_path, new_path)
    print(f"Renamed {old_path} to {new_path}")
