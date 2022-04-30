import uuid

class Session(object):
    """
    A session is an ordered collection of statements
    that are related to each other.
    """

    def __init__(self, session_id=None):
        # A unique identifier for the chat session
        if (session_id is None):
            self.uuid = uuid.uuid1()
        else:
            self.uuid=session_id
        self.id_string = str(self.uuid)
        self.id = str(self.uuid)
        self.intent=None
        self.datetime=None
        self.pre_input=None
        self.advisor_name=None
        self.gamename=None
        self.date = None
        self.phone_number=None
        self.city=None
        self.age=None
        self.date_time=None
        self.To_confirm = None
        self.res_sess=None
        self.Final=None
        self.to_appened=None
        self.validation=None
        self.count=None
        self.email=None

class ConversationSessionManager(object):
    """
    Object to hold and manage multiple chat sessions.
    """

    def __init__(self):
        self.sessions = {}

    def new(self, session_id=None):
        """
        Create a new conversation.
        """
        session = Session(session_id)
        #print("session: " + str(session.id_string))

        self.sessions[session.id_string] = session



        return session
    def delet_session(self,session_object=None,session_id=None):
        self.sessions[session_object]=None
        return True

    def get(self, session_id, default=None):
        """
        Return a session given a unique identifier.
        """
        session=self.sessions.get(str(session_id), default)
        return session

    def update(self, session_id, conversance):
        """
        Add a conversance to a given session if the session exists.
        """
        session_id = str(session_id)
        if session_id in self.sessions:
            self.sessions[session_id].conversation.append(conversance)





