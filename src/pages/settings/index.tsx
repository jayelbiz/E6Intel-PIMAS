@@ .. @@
 import { Container } from '@/components/ui/container'
 import { PageHeader } from '@/components/ui/page-header'
+import { ApiStatus } from '@/components/diagnostics/ApiStatus'
 
 export function SettingsPage() {
   return (
     <Container className="py-8">
       <PageHeader
         title="Settings"
         description="Manage your account preferences and settings"
       />
+      <ApiStatus />
       {/* Rest of settings content */}