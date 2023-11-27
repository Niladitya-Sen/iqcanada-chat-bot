from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

responses: dict[str, str] = {
    "IQ Canada": "Since 2017, the IQ Canada team has worked with over 250 Start-ups from diverse industry segments,helping them seamlessly navigate the Canada Start-up Visa process",
    "startup visa program": "Canada's Start-up Visa Program supports innovative businesses in Canada by providing access to a talented pool of individuals, government support for innovation, and a direct pathway to immigration in Canada.",
    "eligibility": "To be eligible for Canada's Start-up Visa Program, entrepreneurs must have the skills and potential to build businesses in Canada that are innovative, can create jobs for Canadians, and can compete on a global scale.",
    "multiple founders": "Up to 5 founders in a startup are allowed to apply for Canada's Start-up Visa Program together. Each applicant must hold at least 10% of the voting rights in the business, and all applicants combined must hold over 50% of the voting rights.",
    "letter of support": "A Letter of Support is a document provided by a designated organization that supports the entrepreneur's business idea and confirms that the organization is investing in or supporting the business. IQ Canada helps you to obtain a Letter of Support for your business.",
    "ontario": "Ontario is a preferred destination for entrepreneurs because Ontario offers a Global Talent Stream that allows employers to receive Labor Market Impact Assessments in ten (10) business days, making it easier for entrepreneurs to access tech talent.",
    "designated organisation": "Designated organizations are business groups that have been approved by the Canadian government to invest in or support start-ups through the Start-up Visa Program. These organizations include venture capital funds, angel investor groups, and business incubators.",
    "requirements for a startup visa": """
    To qualify for the Start-up Visa Program, you must meet the following eligibility criteria:\n
    1. Have an innovative business\n
    2. Secure a Letter of Support\n
    3. Meet Language Requirements\n
    4. Have Sufficient Settlement Funds\n
    5. Pass Security & Medical Clearance.
    """,
    "permanent residency": """
    Step 1: Prepare your pitch deck\n
    Step 2: Submit your application to designated organization\n
    Step 3: Undergo an interview\n
    Step 4: Sign an agreement\n
    Step 5: Pay the required fees\n
    Step 6: Obtain a Letter of Support\n
    Step 7: Submit your application.\n
    IQ Canada helps you throughout the process by handholding and mentorship
    """,
    "processing time": "SUV processing times can vary depending on the workload of the IRCC. The general guidelines state that the waiting period for the final decision on an application can betbetween 18 months to 3 years.",
    "fees": "Fees can range between $25,000 and $50,000.",
    "innovative business": """
    To determine if your business is innovative, you should consider the following factors:\n
    1. Uniqueness\n
    2. Market Disruption\n
    3. Technology\n
    4. Intellectual Property\n
    5. Scalability.\n
    IQ Canada provides you support to transform your business to innovative one
    """,
}


@socketio.on("connect")
def connect():
    emit(
        "receive-message",
        "Hi, I am Jennifer. Your Personal Assistant for IQ Canada related queries...How may I help you today?",
    )


@socketio.on("send-message")
def handle_send_message(data: str):
    for key in responses.keys():
        pattern = r"\b" + re.escape(key.lower()) + r"\b"
        if re.search(pattern, data.lower()):
            emit("receive-message", responses[key])
            return
    emit("receive-message", "Sorry, I didn't get that. Please try again.")


if __name__ == "__main__":
    socketio.run(app, debug=False, port=3015)  # type: ignore
