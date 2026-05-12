"""
HITTS Horus Plugin.
"""

from HorusAPI import Plugin, PluginPage

hitts_page = PluginPage(
    id="hitts",
    name="HITSS",
    description="High throughput substructure search.",
    html="index.html",
)

plugin = Plugin()

plugin.addPage(hitts_page)
