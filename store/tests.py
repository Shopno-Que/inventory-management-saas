from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from store.models import Store, Team, Invitation
from django.utils import timezone
from datetime import timedelta
import uuid

User = get_user_model()


# =========================================================
# Store permissions (settings + delete)
# =========================================================
class StorePermissionTests(TestCase):

    def setUp(self):
        # Users + store with owner and staff roles
        self.owner = User.objects.create_user(email="owner@test.com", password="pass123")
        self.staff = User.objects.create_user(email="staff@test.com", password="pass123")
        self.other = User.objects.create_user(email="other@test.com", password="pass123")

        self.store = Store.objects.create(name="Test Store", created_by=self.owner)

        Team.objects.create(user=self.owner, store=self.store, role="owner")
        Team.objects.create(user=self.staff, store=self.store, role="staff")

    def test_member_can_access_settings(self):
        """Store member can open settings page."""
        self.client.login(email="owner@test.com", password="pass123")
        response = self.client.get(reverse("store:store_info_settings", args=[self.store.id]))
        self.assertEqual(response.status_code, 200)

    def test_non_member_cannot_access_settings(self):
        """Non-members receive 404 when accessing settings."""
        self.client.login(email="other@test.com", password="pass123")
        response = self.client.get(reverse("store:store_info_settings", args=[self.store.id]))
        self.assertEqual(response.status_code, 404)

    def test_owner_can_delete_store(self):
        """Owner can delete store."""
        self.client.login(email="owner@test.com", password="pass123")
        response = self.client.post(reverse("store:delete_store", args=[self.store.id]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Store.objects.filter(id=self.store.id).exists())

    def test_staff_can_delete_store(self):
        """Staff is allowed to delete store."""
        self.client.login(email="staff@test.com", password="pass123")
        response = self.client.post(reverse("store:delete_store", args=[self.store.id]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Store.objects.filter(id=self.store.id).exists())

    def test_non_member_cannot_delete_store(self):
        """Non-member cannot delete store."""
        self.client.login(email="other@test.com", password="pass123")
        response = self.client.post(reverse("store:delete_store", args=[self.store.id]))
        self.assertEqual(response.status_code, 404)
        self.assertTrue(Store.objects.filter(id=self.store.id).exists())


# =========================================================
# Team, invitation, and staff behavior
# =========================================================
class StoreStaffTests(TestCase):

    def setUp(self):
        # Users + store + roles + invite
        self.owner = User.objects.create_user(email="owner@test.com", password="pass123")
        self.staff = User.objects.create_user(email="staff@test.com", password="pass123")
        self.other = User.objects.create_user(email="other@test.com", password="pass123")

        self.store = Store.objects.create(name="Test Store", created_by=self.owner)

        self.owner_team = Team.objects.create(user=self.owner, store=self.store, role="owner")
        self.staff_team = Team.objects.create(user=self.staff, store=self.store, role="staff")

        self.invite = Invitation.objects.create(
            email="invitee@test.com",
            store=self.store,
            invited_by=self.owner,
            role="staff",
            token=uuid.uuid4(),
            status="pending",
        )

        self.url = reverse("store:accept_invite", args=[self.invite.token])

    # ---------- Models ----------

    def test_team_unique_constraint(self):
        """Same user cannot join same store twice."""
        with self.assertRaises(Exception):
            Team.objects.create(user=self.staff, store=self.store, role="staff")

    def test_store_str(self):
        """Store string equals name."""
        self.assertEqual(str(self.store), "Test Store")

    def test_team_str(self):
        """Team string contains email and role."""
        text = str(self.owner_team)
        self.assertIn(self.owner.email, text)
        self.assertIn("owner", text)

    def test_invite_str(self):
        """Invitation string shows email and role."""
        text = str(self.invite)
        self.assertIn("invitee@test.com", text)
        self.assertIn("staff", text)

    def test_invite_expiry_property(self):
        """Old invites become expired automatically."""
        self.assertEqual(self.invite.effective_status, "pending")

        self.invite.created_at = timezone.now() - timedelta(days=10)
        self.invite.save()
        self.assertEqual(self.invite.effective_status, "expired")

    # ---------- Invite flow ----------

    def test_get_invite_page(self):
        """Invitee can view accept page."""
        user = User.objects.create_user(email="invitee@test.com", password="pass123")
        self.client.login(email=user.email, password="pass123")

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_post_accept_invite(self):
        """Accepting invite creates team and marks invite accepted."""
        user = User.objects.create_user(email="invitee@test.com", password="pass123")
        self.client.login(email=user.email, password="pass123")

        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 302)

        self.invite.refresh_from_db()
        self.assertEqual(self.invite.status, "accepted")
        self.assertIsNotNone(self.invite.accepted_at)

        self.assertTrue(
            Team.objects.filter(user=user, store=self.store, role="staff").exists()
        )

    def test_wrong_user_for_invite(self):
        """Wrong user cannot access invite."""
        self.client.login(email=self.other.email, password="pass123")

        self.assertEqual(self.client.get(self.url).status_code, 403)
        self.assertEqual(self.client.post(self.url).status_code, 403)

    def test_already_accepted_invite(self):
        """Accepted invite returns 404."""
        self.invite.status = "accepted"
        self.invite.save()

        user = User.objects.create_user(email="invitee@test.com", password="pass123")
        self.client.login(email=user.email, password="pass123")

        self.assertEqual(self.client.get(self.url).status_code, 404)

    def test_expired_invite(self):
        """Expired invite cannot be used."""
        self.invite.status = "expired"
        self.invite.save()

        user = User.objects.create_user(email="invitee@test.com", password="pass123")
        self.client.login(email=user.email, password="pass123")

        self.assertEqual(self.client.get(self.url).status_code, 404)

    # ---------- Staff permissions ----------

    def test_owner_cannot_remove_self(self):
        """Owner cannot remove own membership."""
        self.client.login(email=self.owner.email, password="pass123")

        response = self.client.post(
            reverse("store:remove_staff", kwargs={
                "store_id": self.store.id,
                "staff_id": self.owner_team.id
            })
        )
        self.assertEqual(response.status_code, 403)

    def test_staff_cannot_edit_self(self):
        """Staff cannot modify their own role."""
        self.client.login(email=self.staff.email, password="pass123")

        response = self.client.post(
            reverse("store:staff_details", kwargs={
                "store_id": self.store.id,
                "staff_id": self.staff_team.id
            }),
            data={"role": "owner"}
        )

        self.assertEqual(response.status_code, 403)
        self.staff_team.refresh_from_db()
        self.assertEqual(self.staff_team.role, "staff")


class StoreTests(TestCase):

    def setUp(self):
        self.owner = User.objects.create_user(email="owner@test.com", password="pass123")
        self.staff = User.objects.create_user(email="staff@test.com", password="pass123")

        self.store = Store.objects.create(name="Test Store", created_by=self.owner)

        self.owner_team = Team.objects.create(user=self.owner, store=self.store, role="owner")
        self.staff_team = Team.objects.create(user=self.staff, store=self.store, role="staff")


    def test_store_staff_requires_login(self):
        """Anonymous user redirected to login."""
        response = self.client.get(reverse("store:store_staff", args=[self.store.id]))
        self.assertEqual(response.status_code, 302)


    def test_remove_staff_success(self):
        """Owner can remove another staff member."""
        self.client.login(email=self.owner.email, password="pass123")

        response = self.client.post(
            reverse("store:remove_staff", kwargs={
                "store_id": self.store.id,
                "staff_id": self.staff_team.id
            })
        )

        self.assertEqual(response.status_code, 302)
        self.assertFalse(Team.objects.filter(id=self.staff_team.id).exists())


    def test_staff_details_get(self):
        """Viewing staff details page works."""
        self.client.login(email=self.owner.email, password="pass123")

        response = self.client.get(
            reverse("store:staff_details", kwargs={
                "store_id": self.store.id,
                "staff_id": self.staff_team.id
            })
        )

        self.assertEqual(response.status_code, 200)


    def test_accept_invite_get_requires_login(self):
        """Invite page requires authentication."""
        invite = Invitation.objects.create(
            email="a@test.com",
            store=self.store,
            invited_by=self.owner,
            role="staff"
        )

        response = self.client.get(reverse("store:accept_invite", args=[invite.token]))
        self.assertEqual(response.status_code, 302)


    def test_invite_staff_prevents_duplicate_member(self):
        """Cannot invite someone already on the team."""
        self.client.login(email=self.owner.email, password="pass123")

        response = self.client.post(
            reverse("store:invite_staff", args=[self.store.id]),
            {"email": "staff@test.com", "role": "staff"}
        )

        self.assertEqual(response.status_code, 400)


    def test_accept_invite_idempotent_team_creation(self):
        """Accepting invite twice does not duplicate team."""
        invite = Invitation.objects.create(
            email="new@test.com",
            store=self.store,
            invited_by=self.owner,
            role="staff"
        )

        user = User.objects.create_user(email="new@test.com", password="pass123")
        self.client.login(email=user.email, password="pass123")

        url = reverse("store:accept_invite", args=[invite.token])

        self.client.post(url)
        self.client.post(url)

        self.assertEqual(
            Team.objects.filter(user=user, store=self.store).count(),
            1
        )