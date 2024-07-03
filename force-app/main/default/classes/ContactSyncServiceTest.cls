@IsTest
public class ContactSyncServiceTest {
    @TestSetup
    static void setupTestData() {
        // Insert test data
        List<Contact> contacts = new List<Contact>();
        for (Integer i = 0; i < 5; i++) {
            contacts.add(new Contact(
                FirstName = 'Test' + i,
                LastName = 'User' + i,
                Email = 'test' + i + '@example.com'
            ));
        }
        insert contacts;
    }

    @IsTest
    static void testSyncContacts() {
        // Create a mock for HTTP response
        Test.setMock(HttpCalloutMock.class, new ContactSyncServiceMock());

        Test.startTest();
        // Call the method to be tested
        ContactSyncService.syncContacts();
        Test.stopTest();

        // Assertions can be done inside the mock class to check the requests sent
        // We can also verify if the debug log contains certain messages if necessary
    }

    private class ContactSyncServiceMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            // Verify the request
            System.assertEquals('POST', req.getMethod());
            System.assertEquals('application/json', req.getHeader('Content-Type'));
            //System.assertNotNull(req.getHeader('Authorization'));
            System.assert(req.getEndpoint().contains('/services/apexrest/ContactSync'));

            // Create a response
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('{"status":"success"}');
            return res;
        }
    }
}