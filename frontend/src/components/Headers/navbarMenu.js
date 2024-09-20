const navbarMenu = [
  {
    Dahsboard: {
      subMenu: [
        {
          name: "Dashboard",
          link: "/dashboard",
          hr: false,
          role: ["admin", "auditor", "user_freeze", "user_pack", "user_planner", "user_prepare", "user_pst", "user_select"]
        },
        {
          name: "Check Weight Real Time",
          link: "/realtimechart",
          hr: false,
          role: ["admin", "auditor", "user_freeze", "user_pack", "user_planner", "user_prepare", "user_pst", "user_select"]
        },
        {
          name: "Check Weight Sammary",
          link: "/Check Weight Sammary",
          hr: false,
          role: ["admin", "auditor", "user_freeze", "user_pack", "user_planner", "user_prepare", "user_pst", "user_select"]
        },
      ],
      firstRole: ["admin", "auditor", "user_freeze", "user_pack", "user_planner", "user_prepare", "user_pst", "user_select"]
    },
 
  }
]

export default navbarMenu;