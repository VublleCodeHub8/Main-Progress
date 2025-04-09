import React from 'react';

const Documentation = () => {
  const docs = [
    {
      category: 'Getting Started',
      items: [
        { title: 'Introduction', link: '#introduction' },
        { title: 'Quick Start Guide', link: '#quick-start' },
        { title: 'Installation', link: '#installation' },
      ]
    },
    {
      category: 'Container Operations',
      items: [
        { title: 'Creating Containers', link: '#create-container' },
        { title: 'Managing Containers', link: '#manage-container' },
        { title: 'Container Networking', link: '#container-network' },
        { title: 'Volume Management', link: '#volumes' },
      ]
    },
    {
      category: 'Templates & Images',
      items: [
        { title: 'Using Templates', link: '#templates' },
        { title: 'Custom Images', link: '#custom-images' },
        { title: 'Template Library', link: '#template-library' },
      ]
    },
    {
      category: 'Advanced Features',
      items: [
        { title: 'Security & Access', link: '#security' },
        { title: 'Monitoring Tools', link: '#monitoring' },
        { title: 'Auto-scaling', link: '#scaling' },
        { title: 'CI/CD Integration', link: '#cicd' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white text-center">Documentation</h1>
        </div>
      </div>

      {/* Documentation Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                <nav className="space-y-6">
                  {docs.map((section, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{section.category}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <a href={item.link} className="text-gray-600 hover:text-black">
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-8">
                <section id="introduction" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-indigo-700">Introduction</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Welcome to our comprehensive container management platform documentation. This guide provides detailed information about creating, managing, and optimizing your containerized applications.
                  </p>
                  <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100 mt-4">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-3">Key Features</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Intuitive container management interface</li>
                      <li>Pre-built templates for quick deployment</li>
                      <li>Advanced monitoring and scaling capabilities</li>
                      <li>Robust security features</li>
                    </ul>
                  </div>
                </section>

                <section id="create-container" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-indigo-700">Creating Containers</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold mb-4">Using the Dashboard</h3>
                      <ol className="list-decimal list-inside space-y-3 text-gray-700">
                        <li>Navigate to the Containers section</li>
                        <li>Click on "Create New Container"</li>
                        <li>Select a template or start from scratch</li>
                        <li>Configure container settings</li>
                        <li>Deploy your container</li>
                      </ol>
                    </div>
                  </div>
                </section>

                <section id="templates" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-indigo-700">Using Templates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-xl font-semibold mb-3">Programming Language Templates</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>C++ Development</li>
                        <li>Python Environment</li>
                        <li>JavaScript/Node.js</li>
                        <li>More coming soon...</li>
                      </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-xl font-semibold mb-3">System Templates</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Ubuntu (Latest)</li>
                        <li>Alpine Linux</li>
                        <li>Custom Base Images</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                    <h3 className="text-lg font-semibold text-yellow-700 mb-3">Pro Tip</h3>
                    <p className="text-gray-700">Use template variables to customize your deployment. Check our template reference for all available options.</p>
                  </div>
                </section>


                <section id="monitoring" className="mb-12">
                  <h2 className="text-3xl font-bold mb-6 text-indigo-700">Monitoring Tools</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-xl font-semibold mb-3">Resource Usage</h3>
                      <ul className="text-gray-700 space-y-2">
                        <li>✓ CPU metrics</li>
                        <li>✓ Memory usage</li>
                        <li>✓ Disk I/O</li>
                      </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-xl font-semibold mb-3">Logs</h3>
                      <ul className="text-gray-700 space-y-2">
                        <li>✓ Real-time logs</li>
                        <li>✓ Log aggregation</li>
                        <li>✓ Search & filter</li>
                      </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-xl font-semibold mb-3">Alerts</h3>
                      <ul className="text-gray-700 space-y-2">
                        <li>✓ Custom thresholds</li>
                        <li>✓ Email notifications</li>
                        <li>✓ Webhook integration</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;