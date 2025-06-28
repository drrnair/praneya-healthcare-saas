#!/bin/bash

test_function() {
    if [ "true" = "true" ]; then
        echo "Starting heredoc..."
        
        cat <<EOF
-- Test SQL content
SELECT 1;
EOF
        
        echo "Heredoc completed successfully"
    else
        echo "Alternative path"
    fi
}

test_function
echo "Test completed" 