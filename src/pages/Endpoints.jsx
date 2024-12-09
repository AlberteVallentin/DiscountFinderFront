import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 1rem;
  max-width: 100%;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin: 2rem 0;
  width: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  min-width: 650px;
  border-collapse: collapse;
  margin-bottom: 1rem;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  color: #000000;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
  background-color: #f5f5f5;
  color: #000000;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  color: #000000;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SectionTitle = styled.h2`
  margin: 2rem 0 1rem 0;
  color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#000000')};
  font-size: 1.75rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MainTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#000000')};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f8f8f8;
  }
`;

const CodeBlock = styled.pre`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1rem 0;
  color: #000000;
  font-size: 0.9rem;
  max-width: 100%;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const FormatSection = styled.div`
  margin-bottom: 2rem;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FormatTitle = styled.h3`
  margin: 1rem 0;
  color: ${({ theme }) => (theme.isDark ? '#ffffff' : '#000000')};
  font-size: 1.25rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

function Endpoints() {
  const apiEndpoints = [
    {
      method: 'GET',
      url: '/api/stores',
      description: 'Get all stores',
      accessLevel: 'ANYONE',
      response: '[stores, stores, stores, …]',
      errors: 'e1, e2',
    },
    {
      method: 'GET',
      url: '/api/stores/{store_id}',
      description: 'Get specific store and its products',
      accessLevel: 'ANYONE',
      response: 'store',
      errors: 'e1, e2',
    },
    {
      method: 'GET',
      url: '/api/stores/postal_code/{postal_code}',
      description: 'Get stores by postal code',
      accessLevel: 'ANYONE',
      response: '[stores, stores, stores, …]',
      errors: 'e1, e2',
    },
  ];

  const authEndpoints = [
    {
      method: 'POST',
      url: '/api/auth/login',
      description: 'Login user',
      accessLevel: 'ANYONE',
      requestBody: 'user',
      response: 'JWT Token',
      errors: 'e2, e3',
    },
    {
      method: 'POST',
      url: '/api/auth/register',
      description: 'Register new user',
      accessLevel: 'ANYONE',
      requestBody: 'user',
      response: 'user',
      errors: 'e2',
    },
    {
      method: 'POST',
      url: '/api/auth/users/addrole',
      description: 'Add admin role to user',
      accessLevel: 'USER',
      requestBody: 'RoleRequest',
      response: 'message',
      errors: 'e1, e2, e3, e4',
    },
  ];

  const formatExamples = [
    {
      title: '1. Store Response',
      code: `{
  "id": 681,
  "name": "føtex Go! Trøjborg",
  "brand": {
    "displayName": "Føtex"
  },
  "address": {
    "addressLine": "Tordenskjoldsgade 21 St",
    "longitude": 10,
    "latitude": 56,
    "postalCode": {
      "postalCode": 8200,
      "city": "Aarhus N"
    }
  },
  "products": []
}`,
    },
    {
      title: '2. User Request/Response',
      code: `{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "roleType": "USER"
}`,
    },
    {
      title: '3. Role Management',
      code: `// Request:
{
  "role": "ADMIN"
}

// Response:
{
  "msg": "Role ADMIN added to user"
}`,
    },
    {
      title: '4. Error Response Format',
      code: `{
  "status": statusCode,
  "message": "Error description"
}

// Example 404 Not Found:
{
  "status": 404,
  "message": "Resource not found"
}`,
    },
  ];

  const EndpointTable = ({ endpoints, showRequestBody = false }) => (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Method</Th>
            <Th>URL</Th>
            <Th>Description</Th>
            <Th>Access Level</Th>
            {showRequestBody && <Th>Request Body</Th>}
            <Th>Response</Th>
            <Th>Errors</Th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((endpoint, index) => (
            <TableRow key={index}>
              <Td>{endpoint.method}</Td>
              <Td>{endpoint.url}</Td>
              <Td>{endpoint.description}</Td>
              <Td>{endpoint.accessLevel}</Td>
              {showRequestBody && <Td>{endpoint.requestBody || '-'}</Td>}
              <Td>{endpoint.response}</Td>
              <Td>{endpoint.errors}</Td>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );

  return (
    <PageContainer>
      <MainTitle>API Endpoints</MainTitle>

      <SectionTitle>API Endpoints</SectionTitle>
      <EndpointTable endpoints={apiEndpoints} />

      <SectionTitle>Authentication Endpoints</SectionTitle>
      <EndpointTable endpoints={authEndpoints} showRequestBody={true} />

      <SectionTitle>Request/Response Formats</SectionTitle>
      {formatExamples.map((format, index) => (
        <FormatSection key={index}>
          <FormatTitle>{format.title}</FormatTitle>
          <CodeBlock>{format.code}</CodeBlock>
        </FormatSection>
      ))}
    </PageContainer>
  );
}

export default Endpoints;
