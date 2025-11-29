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
- [x] Rebuild Statistics.tsx with mobile-responsive charts
- [x] Make charts stack vertically on mobile
- [x] Ensure intro sequence works on all devices
- [x] Add responsive padding and spacing
- [x] Optimize touch targets for mobile

## Admin Page
- [x] Rebuild Admin.tsx with responsive forms
- [x] Make table horizontally scrollable on mobile
- [x] Optimize form inputs for touch
- [x] Add mobile-friendly navigation
- [x] Ensure all buttons meet 44x44px minimum

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
