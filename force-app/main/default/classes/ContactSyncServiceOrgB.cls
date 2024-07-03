@RestResource(urlMapping='/ContactSync')
    global with sharing class ContactSyncServiceB {
        @HttpPost
        global static void syncContact(String body) {
            Contact contact = (Contact) JSON.deserialize(body, Contact.class);
            
            Contact existingContact = [SELECT Id FROM Contact WHERE Email = :contact.Email LIMIT 1];
    
            if (existingContact == null) {
                insert contact;
            } else {
                contact.Id = existingContact.Id;
                update contact;
            }
        }
    }