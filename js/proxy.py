import sys
import winreg
import socket
import sys


def DeActivate():
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                             r'Software\Microsoft\Windows\CurrentVersion\Internet Settings', 0, winreg.KEY_WRITE)
    except Exception as err:
        print("windowsRG :", err)
        sys.stdout.flush()
    try:
        winreg.SetValueEx(key, 'ProxyEnable', 0, winreg.REG_DWORD, 0)
        winreg.CloseKey(key)
        return sys.exit(0)
    except Exception as err:
        print("windowsRG :", err)
        sys.stdout.flush()
        winreg.CloseKey(key)
        return sys.exit(1)


def check_socks5_proxy(host, port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(2)  # Set a timeout for the connection attempt
            sock.connect((host, port))
            return True
    except (socket.timeout, ConnectionRefusedError):
        return False


def WideSystemProxy(port):
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER,
                             r'Software\Microsoft\Windows\CurrentVersion\Internet Settings', 0, winreg.KEY_WRITE)
    except Exception as err:
        print("windowsRG :", err)
        sys.stdout.flush()
    try:
        winreg.SetValueEx(key, 'ProxyEnable', 0, winreg.REG_DWORD, 1)
        winreg.SetValueEx(key, 'ProxyServer', 0, winreg.REG_SZ,
                          'socks=localhost:' + port + ';')
        winreg.CloseKey(key)
        return sys.exit(0)
    except Exception as err:
        print("windowsRG :", err)
        sys.stdout.flush()
        winreg.CloseKey(key)
        return sys.exit(1)


argument = sys.argv[1]


if argument == 'dis':
    DeActivate()
else:
    WideSystemProxy(argument)
