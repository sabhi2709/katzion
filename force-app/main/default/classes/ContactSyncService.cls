public with sharing class ContactSyncService {
     private static final String NAMED_CREDENTIAL = 'Org_B_Connection'; // Replace with your Named Credential name
    
        @AuraEnabled
        public static void syncContacts() {
            // Get all contacts to be synchronized
            List<Contact> contacts = [SELECT Id, FirstName, LastName, Email FROM Contact];
    
            for (Contact contact : contacts) {
                // Construct the JSON payload
                String payload = JSON.serialize(contact);
    
                // Create the HTTP request
                HttpRequest req = new HttpRequest();
                req.setEndpoint(URL.getOrgDomainUrl().toExternalForm() + '/services/apexrest/ContactSync');
                req.setMethod('POST');
                req.setHeader('Content-Type', 'application/json');
                req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
                req.setBody(payload);
    
                // Send the HTTP request
                Http http = new Http();
                HttpResponse res = http.send(req);
    
                // Check the response status
                if (res.getStatusCode() != 200) {
                    System.debug('Failed to sync contact: ' + res.getBody());
                }
            }
        }
}