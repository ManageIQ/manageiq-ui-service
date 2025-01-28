# Import the rake tasks from manageiq core.
#
# HACK: Since we don't have a proper symlink relationship to core like we do
#   with other plugins, we have to resort to assuming a sibling directory
#   similar to what we do in config/webpack.dev.js.
namespace :app do
  load File.join(__dir__, "../manageiq/lib/tasks/test_security.rake")
end

desc "Rebuild yarn audit pending list"
task :rebuild_yarn_audit_pending do
  ENV["ENGINE_ROOT"] = __dir__
  Rake::Task["app:test:security:rebuild_yarn_audit_pending"].invoke
end
