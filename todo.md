# Geo Events Map - Frontend Rebuild

## Core Layout & Architecture
- [ ] Update index.css with proper z-index CSS variables
- [ ] Rebuild App.tsx with mobile-first routing
- [ ] Create proper overflow handling in main layout
- [ ] Set up responsive breakpoint utilities

## Home Page (Main Map View)
- [x] Rebuild Home.tsx with proper layout structure
- [x] Implement responsive header component
- [x] Create collapsible filter sidebar (mobile overlay, desktop fixed)
- [x] Build map container with z-index: 0
- [x] Create event details panel (mobile full-screen, desktop slide-in)
- [x] Add proper viewport constraints for all panels
- [x] Implement timeline controls
- [x] Add stats overlay

## Components
- [ ] Rebuild EventMapNew with correct z-index
- [ ] Update CategoryFilterNew for mobile responsiveness
- [ ] Rebuild EventDetails with proper positioning
- [ ] Update Timeline component for mobile
- [ ] Rebuild Heatmap component

## Statistics Page
- [ ] Rebuild Statistics.tsx with mobile-responsive charts
- [ ] Make charts stack vertically on mobile
- [ ] Ensure intro sequence works on all devices

## Admin Page
- [ ] Rebuild Admin.tsx with responsive forms
- [ ] Make table horizontally scrollable on mobile
- [ ] Optimize form inputs for touch

## Styling
- [ ] Apply CIA/military theme consistently
- [ ] Ensure all touch targets are 44x44px minimum
- [ ] Add proper hover states for desktop
- [ ] Test all breakpoints (mobile, tablet, desktop)

## Testing
- [ ] Test on mobile viewport (375x667)
- [ ] Test on tablet viewport (768x1024)
- [ ] Test on desktop viewport (1920x1080)
- [ ] Verify z-index layering works correctly
- [ ] Ensure no viewport overflow issues
- [ ] Test all interactive elements
