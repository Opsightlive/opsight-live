#!/bin/bash
# Fix the help route to be public
sed -i '' 's|<Route path="/help" element={<AuthWrapper><Layout><HelpCenter /></Layout></AuthWrapper>} />|<Route path="/help" element={<HelpCenter />} />|g' src/App.tsx
