# TODO: Improve Editing Profile Page

## Information Gathered
- Current profile.view.js has renderProfile with renderView (display) and renderEditForm (edit mode).
- Edit form currently includes bio, birthday, interests (checkboxes), save/cancel.
- Interests are displayed as badges using `renderInterestBadges` from `interestBadge.js`.
- The profile avatar and cover photo background color are currently static or fixed.
- User data is stored and updated via `updateUser` and `getCurrentUser` in `storage.js`.
- Global styles are in `src/styles/global.css`.

## Plan
- Modify renderView to dynamically set cover-photo background based on userData.coverColor.
- Modify renderEditForm:
  - Remove birthday input.
  - Add a file input to upload a profile image from the local device, preview it, and update user avatar.
  - Add a color picker input to change the background color of the cover photo.
  - Change interests editing from checkboxes to badge style toggles, matching the display style on the profile page.
  - Add a save button that saves all changes in real time and redirects back to the profile view showing updated data.
- Add CSS styles for editable interest badges and selected state.
- Ensure all changes persist using `updateUser`.

## Dependent Files
- `src/features/profile/profile.view.js`
- `src/styles/global.css`

## Followup Steps
- [x] Implement the above changes.
- [x] Test image upload and preview.
- [x] Test background color change.
- [x] Test interest badge toggling.
- [x] Verify save functionality and redirection.
