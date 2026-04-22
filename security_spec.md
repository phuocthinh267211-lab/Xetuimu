# Security Spec

## Data Invariants
1. A user cannot modify another user's profile.
2. A user cannot increase their own balance directly via client.
3. System configurations can only be modified by admins.

## The "Dirty Dozen" Payloads
1. Create user with fake role.
2. Create user with missing ID.
3. Update user balance directly.
4. Update user pin not matching owner.
5. Create recharge for another user.
6. Create recharge with negative amount.
7. Update recharge status.
8. Delete an existing recharge.
9. Shadow field injection on User.
10. Spoofed Admin email.
11. Update config without admin.
12. Denial of Wallet via massive array in inventory.
