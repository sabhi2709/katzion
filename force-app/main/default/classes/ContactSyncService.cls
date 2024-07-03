public with sharing class ContactSyncService {
     private static final String NAMED_CREDENTIAL = 'Org_B_Connection'; 
    
        @AuraEnabled
        public static void syncContacts() {
            
            List<Contact> contacts = [SELECT Id, FirstName, LastName, Email FROM Contact];
    
            for (Contact contact : contacts) {
                
                String payload = JSON.serialize(contact);
    
                
                HttpRequest req = new HttpRequest();
                req.setEndpoint(URL.getOrgDomainUrl().toExternalForm() + '/services/apexrest/ContactSync');
                req.setMethod('POST');
                req.setHeader('Content-Type', 'application/json');
                req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());
                req.setBody(payload);
    
                
                Http http = new Http();
                HttpResponse res = http.send(req);
    
               
                if (res.getStatusCode() != 200) {
                    System.debug('Failed to sync contact: ' + res.getBody());
                }
            }
        }
}