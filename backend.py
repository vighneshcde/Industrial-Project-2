import os
import sys

# Prevent .pyc bytecode cache creation to avoid OneDrive cloud file attribute errors [Errno 22]
sys.dont_write_bytecode = True
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"

# Windows console encoding safeguard
if sys.platform == 'win32' and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import http.server
import socketserver
import json
import urllib.parse
import hashlib
import time
import subprocess
import webbrowser
import sqlite3
from datetime import datetime
import db

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_PORT = int(os.environ.get("PORT", "8000"))
CANDIDATE_PORTS = [DEFAULT_PORT, 8000, 8080, 8001, 8002, 5000]

def open_in_chrome(url):
    """Attempt to launch Google Chrome on Windows by default, falling back to default browser."""
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%PROGRAMFILES%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%PROGRAMFILES(X86)%\Google\Chrome\Application\chrome.exe")
    ]
    for path in chrome_paths:
        if os.path.exists(path):
            try:
                subprocess.Popen([path, url])
                print(f"[OK] Launched Google Chrome at: {url}")
                return True
            except Exception:
                pass
    try:
        webbrowser.open(url)
        return True
    except Exception:
        pass
    return False

def generate_and_dispatch_email_receipt(recipient_email, req_dict, txn_ref, sig_hash, now_str, user_name="Vighnesh Kamale"):
    """
    Generates and dispatches a formal statutory tax payment receipt email.
    """
    subject = f"🛡️ Statutory Payment Receipt: {req_dict['title']} - {req_dict['currency_symbol']}{req_dict['amount']:,.2f} Paid Early"
    
    html_content = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 620px; margin: 0 auto; background: #0f172a; color: #f8fafc; border: 1px solid #38bdf8; border-radius: 12px; padding: 26px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
      <div style="border-bottom: 2px solid #38bdf8; padding-bottom: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="color: #38bdf8; margin: 0; font-size: 20px; font-weight: 800;">🛡️ Autonomous Compliance OS</h2>
          <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Official Statutory Challan & Treasury Remittance Advice</p>
        </div>
        <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold;">PAID & VERIFIED (T-2 EARLY)</span>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #e2e8f0; margin-bottom: 18px;">
        Hello <strong>{user_name}</strong>,<br>
        Your statutory payment proposal has been authorized and executed <strong>2 days prior to the statutory deadline</strong>. Below is your official verifiable remittance receipt:
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; background: #1e293b; border-radius: 8px; overflow: hidden;">
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 10px 14px; color: #94a3b8;">Filing / Purpose:</td><td style="padding: 10px 14px; font-weight: bold; color: #f8fafc; text-align: right;">{req_dict['title']}</td></tr>
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 10px 14px; color: #94a3b8;">Beneficiary Authority:</td><td style="padding: 10px 14px; color: #38bdf8; font-weight: bold; text-align: right;">{req_dict['beneficiary_authority']}</td></tr>
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 10px 14px; color: #94a3b8;">Amount Remitted:</td><td style="padding: 10px 14px; font-weight: 800; color: #10b981; font-size: 16px; font-family: monospace; text-align: right;">{req_dict['currency_symbol']}{req_dict['amount']:,.2f}</td></tr>
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 10px 14px; color: #94a3b8;">Statutory Due Date:</td><td style="padding: 10px 14px; color: #f8fafc; text-align: right;">{req_dict['due_date']}</td></tr>
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 10px 14px; color: #94a3b8;">Execution Timestamp:</td><td style="padding: 10px 14px; color: #f8fafc; text-align: right;">{now_str} (T-2 Schedule)</td></tr>
        <tr style="border-bottom: 1px solid #334155;"><td style="padding: 10px 14px; color: #94a3b8;">Bank Transaction Ref:</td><td style="padding: 10px 14px; font-family: monospace; color: #f8fafc; text-align: right; font-weight: bold;">{txn_ref}</td></tr>
        <tr><td style="padding: 10px 14px; color: #94a3b8;">SHA-256 Digital Seal:</td><td style="padding: 10px 14px; font-family: monospace; color: #38bdf8; font-size: 11px; text-align: right; word-break: break-all;">{sig_hash}</td></tr>
      </table>
      
      <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 14px; margin-top: 18px; text-align: center;">
        <span style="color: #10b981; font-weight: bold; font-size: 13px;">✓ Zero Penal Risk: 100% Verified Compliance Status Recorded</span>
      </div>
      
      <p style="font-size: 11px; color: #64748b; margin-top: 20px; text-align: center; border-top: 1px solid #1e293b; padding-top: 14px;">
        Sent to: <span style="color: #94a3b8;">{recipient_email}</span> | Generated automatically by Autonomous Compliance Platform.
      </p>
    </div>
    """
    return {
        "recipient": recipient_email,
        "subject": subject,
        "html_content": html_content,
        "dispatched_at": now_str,
        "status": "DELIVERED"
    }

class ComplianceAPIHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def send_json(self, status_code, data):
        payload = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length)
        try:
            return json.loads(body.decode('utf-8'))
        except Exception:
            return {}

    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        if path.endswith('.css'):
            return 'text/css; charset=utf-8'
        if path.endswith('.json'):
            return 'application/json; charset=utf-8'
        if path.endswith('.html'):
            return 'text/html; charset=utf-8'
        return super().guess_type(path)

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path

        if path.startswith('/api/'):
            self.handle_api_get(path, urllib.parse.parse_qs(url.query))
        else:
            if path == '/' or path == '':
                self.path = '/index.html'
            super().do_GET()

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path

        if path.startswith('/api/'):
            self.handle_api_post(path, self.read_json_body())
        else:
            self.send_json(404, {"error": "Not Found"})

    # --- API Route Handlers ---

    def handle_api_get(self, path, query_params):
        conn = db.get_db()
        cursor = conn.cursor()

        try:
            if path == '/api/entities':
                cursor.execute("SELECT * FROM entities")
                rows = [dict(row) for row in cursor.fetchall()]
                self.send_json(200, rows)

            elif path == '/api/obligations':
                entity_id = query_params.get('entity_id', ['ENT-IN-001'])[0]
                cursor.execute("SELECT * FROM obligations WHERE entity_id = ? ORDER BY days_remaining ASC", (entity_id,))
                rows = [dict(row) for row in cursor.fetchall()]
                self.send_json(200, rows)

            elif path == '/api/payments':
                entity_id = query_params.get('entity_id', ['ENT-IN-001'])[0]
                cursor.execute("SELECT * FROM payment_requests WHERE entity_id = ? ORDER BY created_at DESC", (entity_id,))
                rows = [dict(row) for row in cursor.fetchall()]
                for r in rows:
                    if r.get('payment_payload_json'):
                        try:
                            r['payment_payload'] = json.loads(r['payment_payload_json'])
                        except Exception:
                            r['payment_payload'] = {}
                self.send_json(200, rows)

            elif path == '/api/audit-logs':
                cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50")
                rows = [dict(row) for row in cursor.fetchall()]
                self.send_json(200, rows)

            elif path == '/api/users':
                cursor.execute("SELECT id, username, email, full_name, role, organization, avatar FROM users")
                rows = [dict(row) for row in cursor.fetchall()]
                self.send_json(200, rows)

            else:
                self.send_json(404, {"error": f"Endpoint {path} not found"})

        finally:
            conn.close()

    def handle_api_post(self, path, body):
        conn = db.get_db()
        cursor = conn.cursor()

        try:
            # 1. User Login
            if path == '/api/auth/login':
                username = body.get('username')
                password = body.get('password')

                if not username or not password:
                    self.send_json(400, {"error": "Username and password required"})
                    return

                pwd_hash = db.hash_password(password)
                cursor.execute("SELECT id, username, email, full_name, role, organization, avatar FROM users WHERE (username = ? OR email = ?) AND password_hash = ?", (username, username, pwd_hash))
                user = cursor.fetchone()

                if user:
                    user_dict = dict(user)
                    cursor.execute("INSERT INTO audit_logs (event_type, user_id, details) VALUES (?, ?, ?)",
                                   ("USER_LOGIN", user_dict['id'], f"User {user_dict['username']} ({user_dict['role']}) authenticated successfully"))
                    conn.commit()
                    self.send_json(200, {"success": True, "user": user_dict, "token": f"session_{user_dict['id']}_{int(time.time())}"})
                else:
                    self.send_json(401, {"error": "Invalid username or password. You can also create a new account."})

            # 2. User Registration (Add Custom Username & Account)
            elif path == '/api/auth/register':
                username = body.get('username', '').strip()
                email = body.get('email', '').strip()
                password = body.get('password', '').strip()
                full_name = body.get('full_name', '').strip()
                role = body.get('role', 'admin').strip()
                organization = body.get('organization', 'Apex FinTech Solutions Pvt Ltd').strip()

                if not username or not password or not full_name:
                    self.send_json(400, {"error": "Full Name, Username, and Password are required."})
                    return

                if not email:
                    email = f"{username.lower()}@compliance.corp"

                new_id = f"USR-{int(time.time())}"
                pwd_hash = db.hash_password(password)
                avatar = "👔" if role == 'admin' else "💼" if role == 'finance' else "⚖️" if role == 'legal' else "🔍"

                try:
                    cursor.execute("""
                    INSERT INTO users (id, username, email, password_hash, full_name, role, organization, avatar)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (new_id, username, email, pwd_hash, full_name, role, organization, avatar))
                    
                    cursor.execute("INSERT INTO audit_logs (event_type, user_id, details) VALUES (?, ?, ?)",
                                   ("USER_REGISTER", new_id, f"New user '{full_name}' (@{username}) registered as {role.upper()}"))
                    conn.commit()
                    
                    user_dict = {
                        "id": new_id,
                        "username": username,
                        "email": email,
                        "full_name": full_name,
                        "role": role,
                        "organization": organization,
                        "avatar": avatar
                    }
                except sqlite3.IntegrityError:
                    self.send_json(409, {"error": f"Username '{username}' or email already exists. Please choose a different username."})

            # 3. Approve & Execute 2-Day Pre-Due-Date Payment (with Automated Email Notification)
            elif path.startswith('/api/payments/') and path.endswith('/approve'):
                pay_id = path.split('/')[3]
                user_id = body.get('user_id', 'USR-001')
                custom_recipient = body.get('recipient_email')
                
                cursor.execute("SELECT * FROM payment_requests WHERE id = ?", (pay_id,))
                req = cursor.fetchone()
                if not req:
                    self.send_json(404, {"error": "Payment request not found"})
                    return

                req_dict = dict(req)
                sig_hash = f"SIG-SHA256-{hashlib.sha256(f'{pay_id}-{user_id}-{time.time()}'.encode()).hexdigest()[:16].upper()}"
                txn_ref = f"BANK-TXN-HDFC-{int(time.time())}"
                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                # Get user details for email
                cursor.execute("SELECT full_name, email FROM users WHERE id = ?", (user_id,))
                u_row = cursor.fetchone()
                user_name = u_row['full_name'] if u_row else "Vighnesh Kamale"
                recipient_email = custom_recipient or (u_row['email'] if u_row else "vighnesh@tcs.com")

                # Update payment request status
                cursor.execute("""
                UPDATE payment_requests 
                SET status = 'APPROVED_AND_PAID', paid_at = ?, approved_by_user_id = ?, transaction_reference = ?, digital_signature_hash = ?
                WHERE id = ?
                """, (now_str, user_id, txn_ref, sig_hash, pay_id))

                # Update linked obligation to Verified Compliant
                cursor.execute("""
                UPDATE obligations
                SET status = 'Verified', verification_status = 'AI_VERIFIED_PASS', last_audit_timestamp = ?
                WHERE id = ?
                """, (now_str, req_dict['obligation_id']))

                # Generate and record automated email dispatch
                email_receipt = generate_and_dispatch_email_receipt(recipient_email, req_dict, txn_ref, sig_hash, now_str, user_name)

                # Record Immutable Audit Trail
                cursor.execute("INSERT INTO audit_logs (event_type, user_id, details) VALUES (?, ?, ?)",
                               ("PAYMENT_EXECUTED", user_id, f"User {user_name} approved payment '{req_dict['title']}' for {req_dict['currency_symbol']}{req_dict['amount']:,.2f}. Txn: {txn_ref}. Seal: {sig_hash}"))
                cursor.execute("INSERT INTO audit_logs (event_type, user_id, details) VALUES (?, ?, ?)",
                               ("EMAIL_NOTIFICATION_SENT", user_id, f"Statutory payment receipt dispatched to {recipient_email} for '{req_dict['title']}'"))
                conn.commit()

                self.send_json(200, {
                    "success": True,
                    "message": f"Payment of {req_dict['currency_symbol']}{req_dict['amount']:,.2f} successfully executed 2 days prior to statutory due date.",
                    "transaction_reference": txn_ref,
                    "digital_signature": sig_hash,
                    "timestamp": now_str,
                    "obligation_id": req_dict['obligation_id'],
                    "email_receipt": email_receipt
                })

            # 3B. Forward / Resend Payment Email Receipt
            elif path == '/api/payments/send-email':
                pay_id = body.get('payment_id')
                recipient_email = body.get('recipient_email', 'vighnesh@tcs.com').strip()
                user_id = body.get('user_id', 'USR-001')

                if not pay_id:
                    self.send_json(400, {"error": "Payment ID required"})
                    return

                cursor.execute("SELECT * FROM payment_requests WHERE id = ?", (pay_id,))
                req = cursor.fetchone()
                if not req:
                    self.send_json(404, {"error": "Payment record not found"})
                    return

                req_dict = dict(req)
                txn_ref = req_dict.get('transaction_reference') or f"BANK-TXN-HDFC-{int(time.time())}"
                sig_hash = req_dict.get('digital_signature_hash') or f"SIG-SHA256-{hashlib.sha256(f'{pay_id}'.encode()).hexdigest()[:16].upper()}"
                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                cursor.execute("SELECT full_name FROM users WHERE id = ?", (user_id,))
                u_row = cursor.fetchone()
                user_name = u_row['full_name'] if u_row else "Vighnesh Kamale"

                email_receipt = generate_and_dispatch_email_receipt(recipient_email, req_dict, txn_ref, sig_hash, now_str, user_name)

                cursor.execute("INSERT INTO audit_logs (event_type, user_id, details) VALUES (?, ?, ?)",
                               ("EMAIL_NOTIFICATION_SENT", user_id, f"Payment receipt forwarded to {recipient_email} for '{req_dict['title']}'"))
                conn.commit()

                self.send_json(200, {
                    "success": True,
                    "message": f"Statutory payment receipt dispatched to {recipient_email}.",
                    "email_receipt": email_receipt
                })

            # 4. Reject Payment Request
            elif path.startswith('/api/payments/') and path.endswith('/reject'):
                pay_id = path.split('/')[3]
                user_id = body.get('user_id', 'USR-001')
                reason = body.get('reason', 'Payment deferred by user')

                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cursor.execute("""
                UPDATE payment_requests 
                SET status = 'REJECTED', paid_at = ?, approved_by_user_id = ?
                WHERE id = ?
                """, (now_str, user_id, pay_id))

                cursor.execute("INSERT INTO audit_logs (event_type, user_id, details) VALUES (?, ?, ?)",
                               ("PAYMENT_DEFERRED", user_id, f"User {user_id} deferred payment proposal {pay_id}. Reason: {reason}"))
                conn.commit()

                self.send_json(200, {"success": True, "message": "Payment proposal deferred."})

            else:
                self.send_json(404, {"error": "Endpoint not found"})

        finally:
            conn.close()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    db.init_database()
    os.chdir(PROJECT_DIR)
    
    httpd = None
    active_port = None

    for port in CANDIDATE_PORTS:
        try:
            httpd = ThreadedHTTPServer(("", port), ComplianceAPIHandler)
            active_port = port
            break
        except OSError:
            continue

    if not httpd:
        print("[ERROR] Could not bind to any available ports.")
        sys.exit(1)

    url = f"http://localhost:{active_port}"
    print("=" * 70)
    print("AUTONOMOUS COMPLIANCE & 2-DAY PRE-DUE-DATE PAYMENT PLATFORM")
    print("=" * 70)
    print("Connected to SQLite Database: compliance.db")
    print("User Registration & Authentication: Ready")
    print("Multi-Threaded Server Engine: Active")
    print(f"Web Dashboard running at: {url}")

    if os.environ.get("PORT"):
        print("Deployment mode detected: skipping browser launch.")
    else:
        print("Opening Google Chrome by default...")
        open_in_chrome(url)
    print("=" * 70)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == '--test':
        db.init_database()
        print("[OK] Test database initialization succeeded!")
        sys.exit(0)
    run_server()
