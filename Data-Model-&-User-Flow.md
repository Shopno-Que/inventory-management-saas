# **Data Model & User Flow**

# **Overview**

This document describes the core data model and user flow of the Retail Store Management System. The application is designed as a multi-tenant platform where a single user can own or collaborate on multiple stores while maintaining complete data isolation between stores.

---

# **Core Data Model**

### **User**

The **User** model is the primary identity in the application. Every authenticated person—whether a store owner, staff member, or platform administrator—is represented by a user account.

A user can:

* Create and own one or more stores.  
* Join existing stores through invitations.  
* Access the platform administration dashboard if assigned administrative privileges.

---

### **Store**

The **Store** is the primary business entity of the application.

Every store must have an owner and cannot exist independently without a user account. Each store maintains its own isolated business data.

Each store contains its own:

* Products  
* Sales  
* Orders  
* Expenses  
* Customers  
* Staff members  
* Other operational data

---

# **Staff & Permissions**

Users can be invited to collaborate on stores as staff members.

Each staff member is assigned granular permissions that define which parts of the store they can access or modify. For example, a staff member may be allowed to manage inventory while having no access to sales or expense records.

Permission assignments are scoped to individual stores, allowing the same user to have different roles across different stores.

---

# **Platform Administration**

Platform administrators are also standard user accounts with additional administrative privileges.

Administrators have access to a dedicated platform management dashboard while retaining access to their personal dashboard and any stores they own or collaborate on.

---

# **Feedback System**

The feedback module operates independently from the store data model.

Anyone can submit text feedback along with screenshots directly to platform administrators. Since feedback is not associated with any specific store, it remains isolated from other data models.

---

# **Database Design**

The following entity relationship diagram illustrates the application's data model and the relationships between the core entities.

![Database Design](static/images/hishab-khata-db-design.png)
---

# **User Flow**

## **User Journey**

1. A user creates an account on the platform.  
2. After authentication, the user can either:  
   * Create a new store,  
   * Accept an invitation to join an existing store.  
   * Or work as a staff member of the platform administrator.  
3. Once inside a store or platform admin dashboard, the user can access features according to their assigned permissions.  
4. Users can belong to multiple stores simultaneously and switch between them without creating additional accounts.

---

# **Dashboard Structure**

### **User Dashboard**

Every authenticated user has access to a personal dashboard where they can:

* Manage their profile.  
* Create and manage owned stores.  
* View stores they have joined.  
* Switch between stores.

### **Store Dashboard**

Each store has its own workspace where authorized users can manage:

* Products  
* Sales  
* Orders  
* Expenses  
* Customers  
* Staff members  
* Store settings  
* And other available systems

Access to each section is controlled through the store's permission system.

### **Platform Dashboard**

Platform administrators have access to an additional administration dashboard for managing platform-wide operations while also retaining access to the standard user and store dashboards.
