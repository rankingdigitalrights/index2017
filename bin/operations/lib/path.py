import os

def assets(filename):
    return '../app/assets/static/' + filename

def raw(filename):
    return 'raw/' + filename

def ref(filename):
    return 'operations/ref/' + filename

def companies(filename):
    return '../app/_companies/' + filename

def indicators(filename):
    return '../app/_indicators/' + filename

def categories(filename):
    return '../app/_topics/' + filename

def delete_files_in(folder_path):
    for f in os.listdir(folder_path):
        file_path = os.path.join(folder_path, f)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print e
