//Each user has one or more roles.
//Each role has permissions.
//A page requires one or more permissions to be accessed.

roles = [

    //The basic one
    {   name: 'default',
        description: 'Default role',
        permissions: [
            "basic_functions"
        ]

    },

    //BCC member
    {   name: 'bcc_member',
        description: 'A computer science student from USP RP',
        permissions: [
            "basic_functions",
            "bcc_member_functions"
        ]
    },

    //Admin
    {   name: 'admin',
        description: 'All the privileges',
        permissions: [
            "admin"
        ]
    }

]

module.exports = roles