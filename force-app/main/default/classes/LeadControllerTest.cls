@IsTest
public class LeadControllerTest {
    // Setup test data
    @TestSetup
    static void setupTestData() {
        List<Lead> leads = new List<Lead>();
        for (Integer i = 0; i < 10; i++) {
            leads.add(new Lead(
                FirstName = 'First' + i,
                LastName = 'Last' + i,
                Company = 'Company' + i,
                LeadSource = 'Web',
                Status = 'Open - Not Contacted'
            ));
        }
        insert leads;
    }

    @IsTest
    static void testGetLeads() {
        Test.startTest();
        // Test case 1: Search for specific lead
        List<Lead> leads = LeadController.getLeads('First1', null, 5, 1);
        System.assertEquals(1, leads.size());
        System.assertEquals('First1', leads[0].FirstName);

        // Test case 2: Search with LeadSource filter
        leads = LeadController.getLeads('', 'Web', 5, 1);
        System.assertEquals(5, leads.size()); // Check if it returns correct number of leads per page

        // Test case 3: Pagination test
        leads = LeadController.getLeads('', 'Web', 5, 2);
        System.assertEquals(5, leads.size()); // Check if it returns the next set of leads
        System.assertEquals('First5', leads[0].FirstName); // Verify pagination works
        Test.stopTest();
    }

    @IsTest
    static void testGetLeadCount() {
        Test.startTest();
        // Test case 1: Count leads without any filter
        Integer leadCount = LeadController.getLeadCount('', '');
        System.assertEquals(10, leadCount);

        // Test case 2: Count leads with searchKey filter
        leadCount = LeadController.getLeadCount('First1', '');
        System.assertEquals(1, leadCount);

        // Test case 3: Count leads with LeadSource filter
        leadCount = LeadController.getLeadCount('', 'Web');
        System.assertEquals(10, leadCount);

        // Test case 4: Count leads with both searchKey and LeadSource filter
        leadCount = LeadController.getLeadCount('First', 'Web');
        System.assertEquals(10, leadCount);
        Test.stopTest();
    }
}