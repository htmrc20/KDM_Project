var PORT = 443,
	rec_domain = 'https://careers.eclerx.com/UI',
//    chat_domain = 'http://192.168.1.166:5004/tamak-bot',
    chat_domain = 'http://192.168.86.96:5004/tamak-bot',
    //chat_domain = 'http://192.168.1.166:5000/tamak-bot',
	chat_bot_url = chat_domain,
	upload_file_url = rec_domain + "/UploadHandler.ashx",
	autocomplete_url = rec_domain + "/GetCompletionList",
    resume_count = {},
	trigger_bot_text = "triggerit",
	str_error_msg = "Sorry, We are facing some issue at the moment. Please try again after some time or drop a note to tamak@tamakfoundation.com",
	str_upload_cv_error = "An error occurred while uploading your resume. Please try again.",
	str_new_upload_error = "No worries. Please fill your info in the form btriggery clicking on the <a href='https://careers.eclerx.com/UI/CandidateDetails.aspx' target='_blank'>link</a> and we will get back to you through e-mail or phone shortly. <br/>Alternatively, you can share your resume at <a href='mailto:careers@eclerx.com' target='_top'>careers@eclerx.com</a>.",
	str_fetch_skill_error = "An error occurred while fetching skills",
	str_upload_resume = "your resume here",
	str_qualities_skills = "What qualities and skills",
	str_email_id = "e-mail ID",
	str_name = "your name",
	str_phone = "your phone",
	str_wait_upload_cv = "Please wait while your resume is being uploaded...",
	str_resume_success = " your resume has been uploaded.",
	valid_name = "Please enter your correct name",
	valid_email_id = "Please enter correct e-mail ID",
  	valid_phone_number = "Please provide your 10 digit phone number",
	valid_upload_cv = "Only doc, docx and pdf file formats are supported",
    thanks_msg_end = "Thanks a lot for your time. Have a good day!",
    thanks_msg_end2 = "Thanks a lot for your time. For any queries write us at <a href='mailto:candidate@eclerx.com' target='_top'>candidate@eclerx.com</a>. Have a good day!."
	// chat ends strings
	thank_msg = [
	    'no worries. Please fill',
	    'basis the gdpr',
	    'please fill in the application form by clicking',
	    'please write to us with your queries',
	    'Please fill the info in the form by clicking on the link',
	    'do give us some time to get things moving',
	    'there is some problem while saving your details'
	 ],
	ajax_timeout = 1000,
	max_attempts = 1,
	attempts = 0,
	payload_list = [],
	hr_name = '',
	user_name = '',
	timeout_auto_close_chat = 60000 * 15; // 10 seconds, default
	var $tag_instance;
	var vertical_links = {
	    "financial markets": "https://eclerxmarkets.com/",
	    "digital": "https://www.eclerxdigital.com/",
	    "customer operations": "https://eclerxcustomeroperations.com/",
	    "technology services": "https://moonshott.com/index.html#index",
	    "clx": "https://www.clxeurope.com/",
	};
	var all_tags = [
        "mainframe",
        "c++", "php", "ruby", "python", "c", "asian language skills (mandarin/japanese/spanish etc.)",
        "css & javascript",
        "java development",
        "advanced excel skills",
        "advanced excel with vba, macros",
        "basic excel skills",
        "excel",
        "excel dashboards",
        "excel macros",
        "execution",
        "global foreign exchange",
        "intermediate excel skills",
        "people management/domain expertise",
        "sql/excel",
        "vba (excel vba & ms access)",
        "visual basic (vba) and advance excel",
        ".net development (.net, c#, sql)",
        "accounts payable",
        "aprimo",
        "asian language skills (mandarin/japanese/spanish etc.)",
        "asset control development",
        "backup administrator",
        "basic photoshop skills",
        "bcp and disaster recovery",
        "big data development",
        "blueprism (development/consulting)",
        "business objects (business objects & oracle & pl/sql)",
        "business objects development",
        "business process mapping",
        "campaign management, operations management",
        "centralized procurement",
        "competitive intelligence/ pricing skill set",
        "corp actions",
        "database development (sql/ oracle)",
        "eloqua developers",
        "eusg (desktop administration)",
        "flash developer",
        "graphic designer",
        "hr compensation & benefits",
        "hr operations",
        "informatica development ",
        "intellimatch development",
        "intermediate photoshop skills",
        "internal communications / corporate communications",
        "joomla & wordpress developers",
        "lean / six sigma project management",
        "learning and development",
        "logical aptitude",
        "mobile app (android/ iphone & phonegap & .net & sql)",
        "mvc development",
        "operations acumen",
        "oracle apps dba",
        "oracle functional consultant ( oracle modules ap, ar, gl, fa, procurement , ca & sql)",
        "oracle tech consultant (oracle applications 11i & r12 & sql/ oracle)",
        "paper confirm generation-equity",
        "patient",
        "php development",
        "planning & organizing",
        "portfolio reconcilliation",
        "position services",
        "position validation",
        "pre sales",
        "principal & interest",
        "product sales",
        "project management techniques (ms project, resource scheduling, gantt chart, pert etc)",
        "proxy/class actions",
        "python development",
        "ref data – product",
        "responsible",
        "sharepoint (moss 2007), wss 3.0, sharepoint designer, infopath 2007",
        "sharepoint (sharepoint & moss & asp.net & sql)",
        "sharepoint admin (sharepoint & moss & infopath)",
        "software sales/ business development",
        "spss & sas",
        "tableau developer",
        "team spirit",
        "transaction processing",
        "transportation",
        "ui development",
        "vba development",
        "web operations management",
        "access",
        "access management",
        "accounts receivables",
        "advanced analytics",
        "advanced hardware knowledge",
        "advanced ms office/internet",
        "analytical thinking",
        "analytics",
        "audits",
        "automation testing & sdlc & stlc",
        "avaya+dialers",
        "back office",
        "basic hardware knowledge",
        "basic html & xml",
        "basic ms office/internet",
        "basic salesforce.com",
        "basic sql, ms access or vba",
        "basic web analytics",
        "billing and audits",
        "blockchain",
        "brokerage",
        "business analyst",
        "business intelligence (tableau/ qlikview/ obiee & datawarehouse)",
        "calling/troubleshooting",
        "cash",
        "catalog building skills",
        "cisco routers, switches, firewall",
        "claims",
        "collateral and web site management",
        "collateral management",
        "communication",
        "communication skills",
        "confirmations",
        "customer orientation",
        "data modelling",
        "digital analytics",
        "documentation & flowcharts",
        "email surveillance",
        "equity confirmations",
        "escalation management, incident management",
        "euct (email & lync administration)",
        "eusg (mobile asset administration)",
        "finance",
        "fm-km-trainer",
        "fmea",
        "general admin",
        "hard working",
        "hardware knowledge/troubleshooting knowledge",
        "induction cum knowledge anchor",
        "information security",
        "infrastructure management",
        "initiative",
        "intermediate hardware knowledge",
        "intermediate html & xml",
        "intermediate ms access",
        "intermediate ms office/internet",
        "intermediate sql & vba",
        "internal audits",
        "legal and secretorial",
        "listed derivatives",
        "logical reasoning",
        "machine learning",
        "manual testing & sdlc & stlc",
        "margin-o",
        "market automations",
        "marketing",
        "mobile assets admin",
        "msbi ( ssis, sql, ssas, ssrs)",
        "quality",
        "quality orientation",
        "quantitative",
        "reconciliation",
        "ref data – client",
        "revenue accounting and oracle financial",
        "rfdar reconciliation",
        "sales governance",
        "sdr reconciliation",
        "sem, google adword",
        "site search",
        "social media",
        "social media analytics",
        "software quality assurance",
        "sql dba",
        "stock borrow loans",
        "storage administration",
        "syndicated loans",
        "tag management",
        "teamwork",
        "tqm - total quality management",
        "trainers",
        "travel desk management",
        "treasury and mis",
        "vba",
        "vmware administration",
        "vna trainer",
        "voice avaya",
        "web analytics - adobe sitecatalyst, coremetrics, webtrends, omniture insight, google analytics",
        "windows/ wintel server administration"
];
