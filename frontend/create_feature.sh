#!/bin/bash

# Usage: ./create_feature.sh featureName

FEATURE_NAME=$1

if [ -z "$FEATURE_NAME" ]; then
  echo "Please provide a feature name."
  echo "Usage: ./create_feature.sh featureName"
  exit 1
fi

# Convert to PascalCase for component names
FEATURE_PASCAL=$(echo "$FEATURE_NAME" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')

# Create feature directories
mkdir -p src/features/$FEATURE_NAME/{commonComponents,pages,services,types}

# Create slice file
touch src/features/$FEATURE_NAME/${FEATURE_NAME}Slice.ts

# Create initial commonComponents
touch src/features/$FEATURE_NAME/commonComponents/${FEATURE_PASCAL}List.tsx
touch src/features/$FEATURE_NAME/commonComponents/${FEATURE_PASCAL}Form.tsx
touch src/features/$FEATURE_NAME/commonComponents/${FEATURE_PASCAL}Details.tsx

# Create initial pages
touch src/features/$FEATURE_NAME/pages/${FEATURE_PASCAL}Page.tsx
touch src/features/$FEATURE_NAME/pages/Create${FEATURE_PASCAL}Page.tsx
touch src/features/$FEATURE_NAME/pages/Edit${FEATURE_PASCAL}Page.tsx

# Create services file
touch src/features/$FEATURE_NAME/services/${FEATURE_NAME}Service.ts

# Create types file
touch src/features/$FEATURE_NAME/types/index.ts

# Initialize component with boilerplate code
echo "import React from 'react';

const ${FEATURE_PASCAL}List: React.FC = () => {
  return (
    <div>
      {/* ${FEATURE_PASCAL} List Content */}
    </div>
  );
};

export default ${FEATURE_PASCAL}List;" > src/features/$FEATURE_NAME/commonComponents/${FEATURE_PASCAL}List.tsx

echo "import React from 'react';

const ${FEATURE_PASCAL}Form: React.FC = () => {
  return (
    <form>
      {/* ${FEATURE_PASCAL} Form Content */}
    </form>
  );
};

export default ${FEATURE_PASCAL}Form;" > src/features/$FEATURE_NAME/commonComponents/${FEATURE_PASCAL}Form.tsx

echo "import React from 'react';

const ${FEATURE_PASCAL}Details: React.FC = () => {
  return (
    <div>
      {/* ${FEATURE_PASCAL} Details Content */}
    </div>
  );
};

export default ${FEATURE_PASCAL}Details;" > src/features/$FEATURE_NAME/commonComponents/${FEATURE_PASCAL}Details.tsx

# Initialize pages with boilerplate code
echo "import React from 'react';
import ${FEATURE_PASCAL}List from '../components/${FEATURE_PASCAL}List';
import ${FEATURE_PASCAL}Form from '../components/${FEATURE_PASCAL}Form';

const ${FEATURE_PASCAL}Page: React.FC = () => {
  return (
    <div>
      <h1>${FEATURE_PASCAL} Page</h1>
      <${FEATURE_PASCAL}Form />
      <${FEATURE_PASCAL}List />
    </div>
  );
};

export default ${FEATURE_PASCAL}Page;" > src/features/$FEATURE_NAME/pages/${FEATURE_PASCAL}Page.tsx

echo "import React from 'react';
import ${FEATURE_PASCAL}Form from '../components/${FEATURE_PASCAL}Form';

const Create${FEATURE_PASCAL}Page: React.FC = () => {
  return (
    <div>
      <h1>Create ${FEATURE_PASCAL}</h1>
      <${FEATURE_PASCAL}Form />
    </div>
  );
};

export default Create${FEATURE_PASCAL}Page;" > src/features/$FEATURE_NAME/pages/Create${FEATURE_PASCAL}Page.tsx

echo "import React from 'react';
import ${FEATURE_PASCAL}Form from '../components/${FEATURE_PASCAL}Form';

const Edit${FEATURE_PASCAL}Page: React.FC = () => {
  return (
    <div>
      <h1>Edit ${FEATURE_PASCAL}</h1>
      <${FEATURE_PASCAL}Form />
    </div>
  );
};

export default Edit${FEATURE_PASCAL}Page.tsx;" > src/features/$FEATURE_NAME/pages/Edit${FEATURE_PASCAL}Page.tsx

# Initialize services file with boilerplate code
echo "import apiClient from '../../api/apiClient';
import { ${FEATURE_PASCAL} } from '../types';

const endpoint = '/$FEATURE_NAME';

const ${FEATURE_NAME}Service = {
  getAll: () => apiClient.get<${FEATURE_PASCAL}[]>(endpoint),
  getById: (id: number) => apiClient.get<${FEATURE_PASCAL}>(\`\${endpoint}/\${id}\`),
  create: (data: Partial<${FEATURE_PASCAL}>) => apiClient.post<${FEATURE_PASCAL}>(endpoint, data),
  update: (id: number, data: Partial<${FEATURE_PASCAL}>) => apiClient.put<${FEATURE_PASCAL}>(\`\${endpoint}/\${id}\`, data),
  delete: (id: number) => apiClient.delete(\`\${endpoint}/\${id}\`),
};

export default ${FEATURE_NAME}Service;" > src/features/$FEATURE_NAME/services/${FEATURE_NAME}Service.ts

# Initialize types file with placeholder
echo "export interface ${FEATURE_PASCAL} {
  id: number;
  // Define other fields as per your backend
}" > src/features/$FEATURE_NAME/types/index.ts

echo "Feature '$FEATURE_NAME' has been created with the following structure:"
tree src/features/$FEATURE_NAME
