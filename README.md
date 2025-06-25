# Property Enquiry Form Backend API

A robust Node.js backend API for handling property enquiry form submissions with comprehensive validation, database storage, and management features.

## 🚀 Features

- **Complete CRUD Operations** for property enquiries
- **Input Validation** with detailed error messages
- **MongoDB Integration** with Mongoose ODM
- **Pagination & Filtering** for enquiry management
- **Statistics & Analytics** endpoints
- **Security Middleware** (Helmet, CORS)
- **Request Logging** with Morgan
- **Error Handling** with proper HTTP status codes
- **Environment Configuration** with dotenv

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd surveyPopupBE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/property_enquiry_db

   # JWT Configuration (for future auth)
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=24h

   # CORS Configuration
   CORS_ORIGIN=http://localhost:4200

   # Logging
   LOG_LEVEL=debug
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   # Start MongoDB service
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Base URL: `http://localhost:3000/api`

### 1. Create Enquiry
- **POST** `/enquiry`
- **Description**: Submit a new property enquiry
- **Access**: Public

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "address": "123 Main Street, City, State 12345",
  "age": 30,
  "incomeSource": "salary",
  "reference": "social_media",
  "referencePerson": "Jane Smith",
  "propertyInterests": {
    "residential": true,
    "commercial": false,
    "industrial": false,
    "land": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Enquiry submitted successfully",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "fullName": "John Doe",
    "status": "pending",
    "submittedAt": "2023-07-20T10:30:00.000Z"
  }
}
```

### 2. Get All Enquiries
- **GET** `/enquiry`
- **Description**: Retrieve all enquiries with pagination and filtering
- **Access**: Private (admin only)

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status
- `reference` (string): Filter by reference source
- `startDate` (string): Filter by start date (YYYY-MM-DD)
- `endDate` (string): Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 3. Get Enquiry by ID
- **GET** `/enquiry/:id`
- **Description**: Retrieve a specific enquiry by ID
- **Access**: Private (admin only)

### 4. Update Enquiry Status
- **PATCH** `/enquiry/:id/status`
- **Description**: Update the status of an enquiry
- **Access**: Private (admin only)

**Request Body:**
```json
{
  "status": "in_progress",
  "notes": "Contacted customer for additional information"
}
```

### 5. Delete Enquiry
- **DELETE** `/enquiry/:id`
- **Description**: Delete an enquiry
- **Access**: Private (admin only)

### 6. Get Enquiry Statistics
- **GET** `/enquiry/stats`
- **Description**: Get comprehensive statistics about enquiries
- **Access**: Private (admin only)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEnquiries": 150,
    "todayEnquiries": 5,
    "statusBreakdown": [
      { "_id": "pending", "count": 45 },
      { "_id": "in_progress", "count": 30 },
      { "_id": "completed", "count": 60 },
      { "_id": "rejected", "count": 15 }
    ],
    "referenceBreakdown": [...],
    "incomeSourceBreakdown": [...]
  }
}
```

### 7. Health Check
- **GET** `/health`
- **Description**: Check API health status
- **Access**: Public

## 📊 Data Models

### Enquiry Schema
```javascript
{
  // Personal Information
  firstName: String (required, 2-50 chars),
  lastName: String (required, 2-50 chars),
  address: String (required, 10-500 chars),
  age: Number (required, 18-100),

  // Financial Information
  incomeSource: String (enum: salary, business, freelance, pension, investment, other),

  // Reference Information
  reference: String (enum: social_media, friend, advertisement, website, agent, other),
  referencePerson: String (conditional, 2-100 chars),

  // Property Interests
  propertyInterests: {
    residential: Boolean,
    commercial: Boolean,
    industrial: Boolean,
    land: Boolean
  },

  // Metadata
  status: String (enum: pending, in_progress, completed, rejected),
  notes: String (max 1000 chars),
  submittedAt: Date,
  updatedAt: Date
}
```

## 🔧 Validation Rules

### Personal Information
- **First Name**: 2-50 characters, letters and spaces only
- **Last Name**: 2-50 characters, letters and spaces only
- **Address**: 10-500 characters
- **Age**: 18-100 years

### Financial Information
- **Income Source**: Must be one of the predefined options

### Reference Information
- **Reference**: Must be one of the predefined options
- **Reference Person**: Required if reference is 'friend' or 'agent'

### Property Interests
- At least one property type must be selected

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **Request Logging**: Audit trail with Morgan

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=your_frontend_domain
```

## 📝 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message",
      "value": "invalid value"
    }
  ]
}
```

## 🔍 Testing

Test the API endpoints using tools like:
- **Postman**
- **Insomnia**
- **cURL**
- **Thunder Client (VS Code)**

### Example cURL Commands

**Create Enquiry:**
```bash
curl -X POST http://localhost:3000/api/enquiry \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main Street, City, State 12345",
    "age": 30,
    "incomeSource": "salary",
    "reference": "social_media",
    "propertyInterests": {
      "residential": true,
      "commercial": false,
      "industrial": false,
      "land": false
    }
  }'
```

**Get All Enquiries:**
```bash
curl -X GET "http://localhost:3000/api/enquiry?page=1&limit=10"
```

## 📈 Future Enhancements

- [ ] JWT Authentication & Authorization
- [ ] Email notifications
- [ ] File upload support
- [ ] Advanced search and filtering
- [ ] Export functionality (CSV, PDF)
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository. 