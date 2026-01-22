/**
 * Athena Diagnostic Worker
 * Cloudflare Worker for boundary-respecting systems analysis
 */

// CORS headers for local development and production
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // Use specific origin in production
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

interface DiagnosticRequest {
  institutionName: string;
  institutionType: string;
  statedBoundaries: string;
  observedBehaviors: string;
  specificConcerns?: string;
}

interface DiagnosticResponse {
  diagnostic: string;
}

/**
 * Main request handler
 */
export default {
  async fetch(request: Request): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: CORS_HEADERS,
      });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Please use POST.' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
          },
        }
      );
    }

    try {
      // Parse multipart/form-data
      const formData = await request.formData();

      const diagnosticData: DiagnosticRequest = {
        institutionName: formData.get('institutionName') as string,
        institutionType: formData.get('institutionType') as string,
        statedBoundaries: formData.get('statedBoundaries') as string,
        observedBehaviors: formData.get('observedBehaviors') as string,
        specificConcerns: formData.get('specificConcerns') as string || undefined,
      };

      // Validate required fields
      if (
        !diagnosticData.institutionName ||
        !diagnosticData.institutionType ||
        !diagnosticData.statedBoundaries ||
        !diagnosticData.observedBehaviors
      ) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...CORS_HEADERS,
            },
          }
        );
      }

      // Perform diagnostic analysis
      const diagnostic = await performDiagnostic(diagnosticData);

      // Return diagnostic results
      const response: DiagnosticResponse = {
        diagnostic,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      });

    } catch (error) {
      console.error('Worker error:', error);

      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
          },
        }
      );
    }
  },
};

/**
 * Performs boundary-respecting diagnostic analysis
 */
async function performDiagnostic(data: DiagnosticRequest): Promise<string> {
  const {
    institutionName,
    institutionType,
    statedBoundaries,
    observedBehaviors,
    specificConcerns,
  } = data;

  // Analyze discrepancies between stated boundaries and observed behaviors
  const hasDiscrepancies = analyzeDiscrepancies(statedBoundaries, observedBehaviors);

  // Classify boundary behaviors
  const classification = classifyBoundaryBehavior(statedBoundaries, observedBehaviors);

  // Generate diagnostic report
  let diagnostic = `
    <h4>Institution: ${escapeHtml(institutionName)}</h4>
    <p><strong>Type:</strong> ${formatInstitutionType(institutionType)}</p>

    <h4>Primary Classification</h4>
    <p>${classification.primary}</p>

    <h4>Analysis</h4>
    <p>${classification.analysis}</p>
  `;

  if (classification.subClassifications.length > 0) {
    diagnostic += `
      <h4>Sub-Classifications</h4>
      <ul>
        ${classification.subClassifications.map(sc => `<li>${sc}</li>`).join('')}
      </ul>
    `;
  }

  if (classification.recommendations.length > 0) {
    diagnostic += `
      <h4>Preliminary Recommendations</h4>
      <ul>
        ${classification.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    `;
  }

  if (specificConcerns) {
    diagnostic += `
      <h4>Specific Concerns Addressed</h4>
      <p>${escapeHtml(specificConcerns)}</p>
      <p><em>The concerns raised align with the ${classification.primary.includes('Class A') ? 'boundary-respecting' : 'boundary-ambiguous or boundary-violating'} behaviors identified in this analysis.</em></p>
    `;
  }

  diagnostic += `
    <h4>Next Steps</h4>
    <p>This preliminary assessment suggests ${classification.nextSteps}</p>
  `;

  return diagnostic;
}

/**
 * Analyzes discrepancies between stated and observed boundaries
 */
function analyzeDiscrepancies(stated: string, observed: string): boolean {
  // Simple heuristic: look for keywords indicating violation or inconsistency
  const violationKeywords = [
    'beyond',
    'outside',
    'exceeded',
    'violation',
    'overreach',
    'inconsistent',
    'contrary',
    'despite',
    'however',
    'but',
  ];

  const observedLower = observed.toLowerCase();
  return violationKeywords.some(keyword => observedLower.includes(keyword));
}

/**
 * Classifies boundary behavior based on stated boundaries and observed behaviors
 */
function classifyBoundaryBehavior(stated: string, observed: string) {
  const statedLower = stated.toLowerCase();
  const observedLower = observed.toLowerCase();

  // Keywords for different classifications
  const respectingKeywords = ['consistent', 'adheres', 'maintains', 'follows', 'respects', 'clear', 'explicit'];
  const violatingKeywords = ['violates', 'overreach', 'exceeded', 'beyond', 'outside', 'substitutes', 'contrary'];
  const ambiguousKeywords = ['unclear', 'ambiguous', 'inconsistent', 'varies', 'sometimes', 'ad hoc'];

  const respectingScore = countKeywords(observedLower, respectingKeywords);
  const violatingScore = countKeywords(observedLower, violatingKeywords);
  const ambiguousScore = countKeywords(observedLower, ambiguousKeywords);

  // Determine primary classification
  let primary = '';
  let analysis = '';
  let subClassifications: string[] = [];
  let recommendations: string[] = [];
  let nextSteps = '';

  if (violatingScore > respectingScore && violatingScore > ambiguousScore) {
    // Class C: Boundary-Violating
    primary = '<strong>Class C: Boundary-Violating Behaviors</strong>';
    analysis = 'The observed behaviors demonstrate systematic boundary violations through scope expansion, criterion manipulation, or authority overreach. The institution exercises judgment beyond its legitimate authority or competence boundaries.';

    subClassifications = [
      '<strong>C1:</strong> Scope Overreach - Exercise of judgment beyond legitimate authority',
      '<strong>C2:</strong> Criterion Shifting - Modification of evaluation criteria to enable desired outcomes',
    ];

    if (observedLower.includes('substitute') || observedLower.includes('override')) {
      subClassifications.push('<strong>C3:</strong> Proxy Judgment Substitution - System judgment replaces stakeholder judgment');
    }

    recommendations = [
      'Establish explicit boundary definitions with public documentation',
      'Implement procedural checks requiring criterion citation',
      'Create external accountability mechanisms for boundary violations',
      'Provide institutional training on boundary maintenance',
      'Institute regular boundary audits',
    ];

    nextSteps = 'immediate attention to boundary clarification and violation remediation. External review may be warranted given the severity of boundary violations.';

  } else if (ambiguousScore > respectingScore) {
    // Class B: Boundary-Ambiguous
    primary = '<strong>Class B: Boundary-Ambiguous Behaviors</strong>';
    analysis = 'The institution demonstrates unclear boundaries or inconsistent boundary application, creating uncertainty about legitimate scope. While not systematic violations, the ambiguity enables potential boundary transgression.';

    subClassifications = [
      '<strong>B1:</strong> Undefined Boundaries - Absence of clear boundary specification',
      '<strong>B2:</strong> Inconsistent Application - Boundary application varies across cases',
    ];

    if (observedLower.includes('deliberate') || observedLower.includes('flexible')) {
      subClassifications.push('<strong>B3:</strong> Boundary Ambiguity Maintenance - Deliberate preservation of unclear boundaries');
    }

    recommendations = [
      'Develop explicit boundary documentation',
      'Establish consistent criteria for boundary application',
      'Create procedures for boundary clarification when ambiguity arises',
      'Implement regular review of boundary consistency',
      'Provide training on appropriate boundary maintenance',
    ];

    nextSteps = 'boundary clarification through explicit documentation and procedural development. The institution should prioritize consistent boundary application.';

  } else {
    // Class A: Boundary-Respecting
    primary = '<strong>Class A: Boundary-Respecting Behaviors</strong>';
    analysis = 'The institution demonstrates consistent boundary maintenance and appropriate scope limitation. Decision-making remains within defined boundaries without criterion manipulation or scope expansion.';

    subClassifications = [
      '<strong>A1:</strong> Clear Boundary Definition - Explicit documentation of scope and criteria',
      '<strong>A2:</strong> Consistent Boundary Maintenance - Regular adherence to established boundaries',
    ];

    if (statedLower.includes('defer') || observedLower.includes('recogniz')) {
      subClassifications.push('<strong>A3:</strong> Boundary Recognition and Deference - System acknowledges and respects boundary limits');
    }

    recommendations = [
      'Continue current boundary maintenance practices',
      'Document successful approaches for organizational learning',
      'Consider sharing boundary-respecting practices with similar institutions',
      'Maintain regular boundary review to prevent gradual erosion',
    ];

    nextSteps = 'continued maintenance of current practices with regular monitoring to ensure boundary integrity is preserved.';
  }

  return {
    primary,
    analysis,
    subClassifications,
    recommendations,
    nextSteps,
  };
}

/**
 * Counts occurrences of keywords in text
 */
function countKeywords(text: string, keywords: string[]): number {
  return keywords.reduce((count, keyword) => {
    return count + (text.includes(keyword) ? 1 : 0);
  }, 0);
}

/**
 * Formats institution type for display
 */
function formatInstitutionType(type: string): string {
  const typeMap: Record<string, string> = {
    academic: 'Academic Institution',
    healthcare: 'Healthcare System',
    regulatory: 'Regulatory/Licensing Body',
    platform: 'Digital Platform',
    government: 'Government Agency',
    corporate: 'Corporate Organization',
    other: 'Other',
  };

  return typeMap[type] || type;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
