#!/bin/bash

OUTPUT_FILE="audit-raw-data.txt"
> $OUTPUT_FILE

echo "=== 1. PROJECT STRUCTURE (src directories) ===" >> $OUTPUT_FILE
find src -type d | sort >> $OUTPUT_FILE

echo -e "\n=== 2. FILE COUNTS ===" >> $OUTPUT_FILE
echo "Total TS/TSX files:" >> $OUTPUT_FILE
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l >> $OUTPUT_FILE
echo "Total files:" >> $OUTPUT_FILE
find src -type f | wc -l >> $OUTPUT_FILE

echo -e "\n=== 3. ROUTING STRUCTURE (pages, layouts, routes) ===" >> $OUTPUT_FILE
find src/app -type f \( -name "page.tsx" -o -name "layout.tsx" -o -name "route.ts" \) | sort >> $OUTPUT_FILE

echo -e "\n=== 4. PARAMS USAGE (potential Next.js 15+ issues) ===" >> $OUTPUT_FILE
grep -rn 'params\.' src/app | head -50 >> $OUTPUT_FILE

echo -e "\n=== 5. CONSOLE.LOG USAGE ===" >> $OUTPUT_FILE
grep -rn 'console\.log' src | wc -l >> $OUTPUT_FILE
echo "First 30 console.log usages:" >> $OUTPUT_FILE
grep -rn 'console\.log' src | head -30 >> $OUTPUT_FILE

echo -e "\n=== 6. ANY TYPES USAGE ===" >> $OUTPUT_FILE
echo "Count of ': any' usages:" >> $OUTPUT_FILE
grep -rn ': any' src | wc -l >> $OUTPUT_FILE
echo "First 30 ': any' usages:" >> $OUTPUT_FILE
grep -rn ': any' src | head -30 >> $OUTPUT_FILE

echo -e "\n=== 7. HARDCODED URLS ===" >> $OUTPUT_FILE
echo "localhost URLs:" >> $OUTPUT_FILE
grep -rn 'http://localhost' src >> $OUTPUT_FILE
echo "wazo-market URLs:" >> $OUTPUT_FILE
grep -rn 'wazo-market.vercel.app' src >> $OUTPUT_FILE

echo -e "\n=== 8. ASYNC COMPONENTS WITHOUT AWAIT ===" >> $OUTPUT_FILE
grep -rn 'export default async function' src/app >> $OUTPUT_FILE
grep -rn 'export default async function' src/app -A 5 | grep -v 'await params' >> $OUTPUT_FILE

echo "Audit data collection complete. Results saved to $OUTPUT_FILE"
