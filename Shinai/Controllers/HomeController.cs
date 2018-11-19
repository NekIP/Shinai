using Microsoft.AspNetCore.Mvc;

namespace SinglePageMP.Controllers
{
	public class HomeController : Controller
	{
		[HttpGet]
		public IActionResult Index()
		{
			return View("Views/Index.cshtml");
		}
	}
}
