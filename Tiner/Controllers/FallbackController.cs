using Microsoft.AspNetCore.Mvc;

namespace Tiner.Controllers;

public class FallbackController : Controller
{
    public ActionResult Index() => PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
}