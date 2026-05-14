"""
My Plugin for Horus.
"""

from HorusAPI import Plugin, PluginPage

my_plugin_page = PluginPage(
    id="my_plugin",
    name="My Plugin",
    description="My plugin for Horus.",
    html="index.html",
)

plugin = Plugin()

plugin.addPage(my_plugin_page)
