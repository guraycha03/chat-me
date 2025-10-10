# TODO for Profile Navigation on Post Avatar Click

## Steps:

- [x] Update the avatar click handler in `src/features/components/postComponent.js`:
  - Remove dependency on `profileContainer`.
  - Dispatch a 'navigate' CustomEvent with `{ page: 'profile', userId: userData.id }`.
  - Add fallback if `userData.id` is missing (navigate to current user's profile).
  - Retain `cursor: pointer` for UX.

- [x] After edit, update this TODO.md to mark the step as completed.

- [ ] Followup: Test the navigation in the app (e.g., click avatar in home feed to ensure it routes to the post owner's profile page).

# TODO for Displaying Posts on Profile Page

## Steps:

- [x] Update post fetching logic in `src/features/profile/profile.view.js` to handle both mock friends' posts (from `userData.posts`) and stored posts (from localStorage), sort by date (newest first), and reuse `createPostElement`.

- [ ] After edit, update this TODO.md to mark the step as completed.

- [ ] Followup: Test the post display on profile pages (e.g., navigate to a friend's profile and verify their posts show correctly, sorted by date).

# TODO for Scrolling to Top on Profile Navigation from Post Avatar

## Steps:

- [ ] Update `src/features/profile/profile.view.js` to scroll to the top of the page when rendering the profile (after `renderView()`).

- [ ] After edit, update this TODO.md to mark the step as completed.

- [ ] Followup: Test the navigation from post avatar click to ensure it navigates to profile and scrolls to the top (profile header visible).
