# Azure CRUD API Frontend

A React TypeScript frontend application that integrates with Azure Functions to provide a complete CRUD (Create, Read, Update, Delete) interface for managing orders.

## Features

- **List Orders**: View all orders in a grid layout with order details
- **Create Orders**: Add new orders with customer information, shipping address, and multiple items
- **Update Orders**: Modify existing orders including status updates
- **Delete Orders**: Remove orders from the system
- **Product Management**: Initialize and view available products
- **Real-time API Integration**: Direct integration with Azure Functions
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with proper error handling

## Prerequisites

- Node.js 18.x LTS or later
- npm or yarn package manager
- Azure Functions backend deployed and running

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Before running the application, you need to configure the API base URL:

1. Start the application:
   ```bash
   npm start
   ```

2. Open your browser to `http://localhost:3000`

3. In the "API Base URL" field, enter your Azure Functions URL:
   - Format: `https://your-function-app-name.azurewebsites.net/api`
   - Example: `https://mycrudfunc.azurewebsites.net/api`

## Usage

### 1. Initialize Products
- Click the "Initialize Products" button to populate the database with sample products
- This only needs to be done once after deployment

### 2. List Orders
- Navigate to the "List Orders" tab
- Click "Refresh Orders" to load the latest data
- View order details including customer name, address, status, and total
- Use "View/Edit" to select an order for updating
- Use "Delete" to remove orders

### 3. Create Orders
- Navigate to the "Create Order" tab
- Fill in customer name and shipping address
- Add items by selecting products from the dropdown and specifying quantities
- Click "Add Item" to add more products to the order
- Click "Create Order" to save the new order

### 4. Update Orders
- First select an order from the "List Orders" tab using "View/Edit"
- Navigate to the "Update Order" tab
- Modify the order details as needed
- Update the status using the dropdown (Pending, Processing, Shipped, Delivered, Cancelled)
- Click "Update Order" to save changes

## API Endpoints

The frontend integrates with the following Azure Functions:

- `GET /orders` - List all orders
- `GET /orders/{id}` - Get specific order
- `POST /orders` - Create new order
- `PUT /orders/{id}` - Update existing order
- `DELETE /orders/{id}` - Delete order
- `GET /products` - List all products
- `POST /products/init` - Initialize products

## Development

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

### Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Application styles
├── index.tsx        # Application entry point
└── index.css        # Global styles
```

### Key Components

- **API Configuration**: Set the base URL for Azure Functions
- **Tab Navigation**: Switch between different operations
- **Order Management**: Complete CRUD operations for orders
- **Product Integration**: Dynamic product selection for orders
- **Error Handling**: Comprehensive error display and handling
- **Loading States**: Visual feedback during API calls

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the API base URL is correct
   - Ensure Azure Functions are deployed and running
   - Check CORS settings in Azure Functions

2. **Products Not Loading**
   - Click "Initialize Products" to populate the database
   - Check Azure Functions logs for errors

3. **Orders Not Saving**
   - Verify all required fields are filled
   - Check browser console for error messages
   - Ensure Azure Functions have proper permissions

4. **CORS Issues**
   - Add CORS configuration to Azure Functions
   - Ensure the frontend URL is allowed in CORS settings

### Debug Mode

To enable debug mode and see detailed API responses:

1. Open browser developer tools (F12)
2. Check the Console tab for error messages
3. Check the Network tab for API call details

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deploy to Azure Static Web Apps

1. Install Azure Static Web Apps CLI:
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

2. Deploy:
   ```bash
   swa deploy build
   ```

### Deploy to Other Platforms

The built files can be deployed to any static hosting service:
- Azure Blob Storage
- GitHub Pages
- Netlify
- Vercel
- AWS S3

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
