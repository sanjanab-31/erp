import os
import re
import sys

def remove_comments_from_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove multi-line comments /* ... */
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)
        
        # Remove single-line comments // ...
        # We try to avoid matching http:// or https://
        # This regex matches // only if it's at the start of a line or preceded by whitespace
        # and not inside a string (best effort)
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            # Simple check for // that isn't part of a URL
            if '//' in line:
                # Find the position of //
                pos = line.find('//')
                # Check if it's preceded by : (likely a URL)
                if pos > 0 and line[pos-1] == ':':
                    new_lines.append(line)
                else:
                    new_lines.append(line[:pos].rstrip())
            else:
                new_lines.append(line)
        
        new_content = '\n'.join(new_lines)
        
        # Also remove empty braces with only comments inside that became empty
        # and double empty lines
        new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    target_dirs = ['frontend/src', 'backend/src', 'payment-server']
    extensions = ['.js', '.jsx', '.css']
    
    workspace_root = os.getcwd() # Assuming run from c:\Users\Sasi\Desktop\erp
    
    for tdir in target_dirs:
        abs_dir = os.path.join(workspace_root, tdir)
        if not os.path.exists(abs_dir):
            print(f"Directory not found: {abs_dir}")
            continue
            
        for root, _, files in os.walk(abs_dir):
            for file in files:
                if any(file.endswith(ext) for ext in extensions):
                    file_path = os.path.join(root, file)
                    print(f"Cleaning {file_path}...")
                    remove_comments_from_file(file_path)

if __name__ == "__main__":
    main()
