using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;
using System.Web.UI;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public static readonly IList<DefaultModel> _comments;
        private static int _result;
        public static double _tol;

        static HomeController()
        {
            _comments = new List<DefaultModel>
            {
                new DefaultModel{ index = "0", tolerence = 0, multiplier = 1, color = "black", text = "Black" },
                new DefaultModel{ index = "1", tolerence = 1, multiplier = 10, color = "brown", text = "Brown" },
                new DefaultModel{ index = "2", tolerence = 2, multiplier = 100, color = "red", text = "Red" },
                new DefaultModel{ index = "3", multiplier = 1000, color = "orange", text = "Orange" },
                new DefaultModel{ index = "4", multiplier = 10000, color = "yellow", text = "Yellow" },
                new DefaultModel{ index = "5", tolerence = 0.5, multiplier = 100000, color = "green", text = "Green" },
                new DefaultModel{ index = "6", tolerence = 0.25, multiplier = 1000000, color = "blue", text = "Blue" },
                new DefaultModel{ index = "7", tolerence = 0.10, multiplier = 10000000, color = "violet", text = "Violet" },
                new DefaultModel{ index = "8", tolerence = 0.05, color = "grey", text = "Grey" },
                new DefaultModel{ index = "9", color = "white", text = "White" },
                new DefaultModel{ index = "10", tolerence = 5, multiplier = 0.1, color = "#FFD700", text = "Gold" },
                new DefaultModel{ index = "11", tolerence = 10, multiplier = 0.01, color = "#C0C0C0", text = "Silver" },
            };
        }

        public ActionResult Index()
        {
            return View();
        }

        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Tol()
        {
            return Json(_tol, JsonRequestBehavior.AllowGet);
        }

        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Results()
        {
            return Json(_result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SubmitForm(DefaultModel comment)
        {
            IOhmValueCalculator cal = new OhmCalculate();
            
            _result = cal.CalculateOhmValue(comment.bandA, comment.bandB, comment.bandC, comment.bandD);
            return Content("Success :)");
        }

        
    }

    public interface IOhmValueCalculator
    {
        /// <summary>
        /// Calculates the Ohm value of a resistor based on the band colors.
        /// </summary>
        /// <param name="bandAColor">The color of the first figure of component value band.</param>
        /// <param name="bandBColor">The color of the second significant figure band.</param>
        /// <param name="bandCColor">The color of the decimal multiplier band.</param>
        /// <param name="bandDColor">The color of the tolerance value band.</param>
        int CalculateOhmValue(string bandAColor, string bandBColor, string bandCColor, string bandDColor);
    }

    public class OhmCalculate : IOhmValueCalculator
    {
        public int CalculateOhmValue(string bandAColor, string bandBColor, string bandCColor, string bandDColor)
        {
            double num1 = 0;
            double num2 = 0;
            double num3 = 0;
            double num4 = 0;
            double num = 0;
            foreach (DefaultModel model in HomeController._comments)
            {
                if (model.color == bandDColor)
                {
                    num = model.tolerence;
                    break;
                }
            }
            HomeController._tol = num;
            foreach (DefaultModel model in HomeController._comments) {
                if (model.color == bandAColor) {
                    num1 = int.Parse(model.index);
                    break;
                }
            }
            foreach (DefaultModel model in HomeController._comments)
            {
                if (model.color == bandBColor)
                {
                    num2 = int.Parse(model.index);
                    break;
                }
            }
            foreach (DefaultModel model in HomeController._comments)
            {
                if (model.color == bandCColor)
                {
                    num3 = model.multiplier;
                    break;
                }
            }
            foreach (DefaultModel model in HomeController._comments)
            {
                if (model.color == bandDColor)
                {
                    num4 = model.tolerence;
                    break;
                }
            }
            double result = (num1 * 10 + num2) * num3;
            return (int)result;
            throw new NotImplementedException();
        }

    }
}