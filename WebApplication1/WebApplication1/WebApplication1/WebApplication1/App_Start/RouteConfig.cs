using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebApplication1
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Tol",
                url: "eletronicColorCode/tol",
                defaults: new { controller = "Home", action = "Tol" }
            );

            routes.MapRoute(
                name: "Result",
                url: "eletronicColorCode/result",
                defaults: new { controller = "Home", action = "Results" }
            );

            routes.MapRoute(
                name: "Submit",
                url: "eletronicColorCode/submit",
                defaults: new { controller = "Home", action = "SubmitForm" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
