# TODO: Update Posts Styling

- [x] Modify `src/features/feed/feed.controller.js` to add "text-post" class to post-card when no image is present
- [x] Update `src/styles/global.css` to style text posts with larger font (24px) like Facebook
- [x] Update `src/styles/global.css` to make image posts 1:1 ratio (300px square) like Instagram
- [x] Improve overall post styling for cleanliness and realism (spacing, shadows)
- [x] Move text above image for image posts and make post date more prominent
- [x] Update profile posts grid styling for cleanliness (larger grid, card style with image and text)
- [x] Add padding below posts grid to prevent bottom nav overlap
- [x] Test the changes by running the app and checking the feed and profile displays

# TODO: Implement Page Persistence on Refresh

- [x] Modify `src/app.js` to parse URL parameters on initial load and prioritize URL over localStorage for page rendering
- [x] Update localStorage when loading from URL and set history state
- [ ] Test page persistence by navigating to different pages and refreshing the browser
