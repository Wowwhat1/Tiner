using Microsoft.AspNetCore.Mvc;
using Tiner.Helpers;

namespace Tiner.Controllers;

[ServiceFilter(typeof(LogUserActivity))]
[ApiController]
[Route("api/[controller]")]
public class BaseApiController : ControllerBase
{

}