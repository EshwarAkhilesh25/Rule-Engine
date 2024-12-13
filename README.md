# Rule Engine

A simple rule engine that allows users to create and evaluate complex rules based on specified conditions. The project utilizes MongoDB for storing rules and evaluates them against provided JSON data using an Abstract Syntax Tree (AST).

# Features
Create Rules: Users can define rules using a string format.
Evaluate Rules: Rules can be evaluated against provided JSON data.
MongoDB Integration: Utilizes MongoDB for storing and retrieving rules.
Abstract Syntax Tree (AST): Rules are parsed and evaluated using an AST for complex conditions.

# Technologies Used

Node.js \
Express.js \
MongoDB (Mongoose) \
Axios (for API requests) \
CORS \
Body-parser

# Getting Started

Follow the instructions below to set up the project on your local machine for development and testing purposes.

## Setup Instructions

### Clone the Repository
```bash
git clone https://github.com/yourusername/rule-engine.git
cd rule-engine
```

### Install Dependencies
Navigate to the project directory and install the necessary packages:

Bash
```bash
npm install
```

### Configure MongoDB
Update the MongoDB connection URL in the server file (server.js) with your own MongoDB connection string. Find the following line:

```JavaScript
mongoose.connect('YOUR_MONGODB_URL_HERE', { useNewUrlParser: true, useUnifiedTopology: true })
```

Replace YOUR_MONGODB_URL_HERE with your actual MongoDB connection string.

### Run the Server
Start the server with the following command:

```bash
node server.js
```

The server will run on http://localhost:3000.

### Access the Frontend
Open the index.html file in your browser to access the rule engine interface and interact with the API.

 
## API Endpoints
### Create Rule
POST /create_rule  

Request Body:

```JSON
{
  "rule": "YOUR_RULE_STRING"
}
```

Response:

```JSON
{
  "success": true,
  "ruleId": "RULE_ID"
}
```

### Evaluate Rule
POST /evaluate_rule

Request Body:
```JSON
{
  "ruleId": "YOUR_RULE_ID",
  "data": {
    "age": 45,
    "department": "HR",
    "experience": 12,
    "projects_completed": 15
  }
}
```

Response:
```JSON
{
  "isValid": true/false
}
```

### Combine Rules
POST /combine_rules  

Request Body:

```JSON
age > 25 AND income >= 40000
department = 'Engineering'
spend < 20000 OR income > 70000
```

Response:

```JSON
{
  "success": true,
  "ruleId": "RULE_ID"
}
```

## Example Rules and Data
### Example Rule:

```((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)```

### Example Data:
```JSON
{
  "age": 45,
  "department": "HR",
  "experience": 12,
  "projects_completed": 15
}
```

### Expected Evaluation Result:
Given the example rule and data above, the evaluation will return false since the conditions defined in the rule are not met by the provided data.