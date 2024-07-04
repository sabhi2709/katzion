public with sharing class LeadController {
    
    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads(String searchKey, String leadSource, Integer pageSize, Integer pageNumber) {
        String searchPattern = '%' + searchKey + '%';
        String leadSourcePattern = leadSource != null ? '%' + leadSource + '%' : '%';
        Integer offsetSize = (pageNumber - 1) * pageSize;

        String query = 'SELECT Id, FirstName, LastName, Company, LeadSource, Status FROM Lead WHERE (FirstName LIKE :searchPattern OR LastName LIKE :searchPattern) AND LeadSource LIKE :leadSourcePattern';
        //String query = 'SELECT Id, FirstName, LastName, Company, LeadSource, Status FROM Lead WHERE (FirstName LIKE :searchPattern OR LastName LIKE :searchPattern) AND LeadSource LIKE :leadSourcePattern LIMIT :pageSize OFFSET :offsetSize';
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static Integer getLeadCount(String searchKey, String leadSource) {
        String searchPattern = '%' + searchKey + '%';
        String leadSourcePattern = leadSource != null ? '%' + leadSource + '%' : '%';

        String query = 'SELECT COUNT() FROM Lead WHERE (FirstName LIKE :searchPattern OR LastName LIKE :searchPattern OR Company LIKE :searchPattern) AND LeadSource LIKE :leadSourcePattern';
        return Database.countQuery(query);
    }
}